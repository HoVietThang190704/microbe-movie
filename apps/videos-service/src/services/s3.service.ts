import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  UploadPartCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Config } from '../libs/types/s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private config: S3Config;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<S3Config>('s3')!;

    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId || '',
        secretAccessKey: this.config.secretAccessKey || '',
      },
    });
  }

  async initiateMultipartUpload(
    key: string,
    filename: string,
    expiresIn: number = 3600,
  ): Promise<{ uploadId: string; key: string }> {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: 'video/mp4',
      Metadata: {
        'original-filename': filename,
      },
      Expires: new Date(Date.now() + expiresIn * 1000),
    });

    try {
      const response = await this.s3Client.send(command);
      return {
        uploadId: response.UploadId!,
        key,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to initiate multipart upload',
      );
    }
  }

  async getSignedPartUrl(
    key: string,
    uploadId: string,
    partNumber: number,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.config.bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to get signed part URL',
      );
    }
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { PartNumber: number; ETag: string }[],
  ): Promise<{ location: string; bucket: string; key: string }> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.config.bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          PartNumber: part.PartNumber,
          ETag: part.ETag,
        })),
      },
    });

    try {
      const response = await this.s3Client.send(command);
      return {
        location: response.Location || '',
        bucket: response.Bucket || '',
        key: response.Key || '',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to complete multipart upload',
      );
    }
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.config.bucket,
      Key: key,
      UploadId: uploadId,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to abort multipart upload',
      );
    }
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to delete object',
      );
    }
  }

  async objectExists(key: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error checking object existence:', error);
      return false;
    }
  }
}
