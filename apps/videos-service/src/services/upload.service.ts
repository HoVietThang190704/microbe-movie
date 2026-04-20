import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { S3Service } from './s3.service';
import {
  S3_SERVICE_TOKEN,
  UPLOAD_REPOSITORY_TOKEN,
} from '../libs/shared/constant/videos';
import {
  CancelUploadDto,
  CancelUploadResponseDto,
  CompleteUploadDto,
  CompleteUploadResponseDto,
  GetPartPresignedUrlDto,
  InitiateUploadDto,
  InitiateUploadResponseDto,
  PartPresignedUrlResponseDto,
} from '@libs';
import { UploadRepository } from '../respository/upload.repository';
import { Video } from '../database/entities/video.schema';

@Injectable()
export class UploadService {
  private readonly PART_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_PARTS = 10000; // S3 allows a maximum of 10,000 parts
  private readonly PRESIGNED_URL_EXPIRATION = 3600; // 1 hour
  private readonly UPLOAD_EXPIRY_HOURS = 24;

  constructor(
    @Inject(S3_SERVICE_TOKEN) private readonly s3Service: S3Service,
    @Inject(UPLOAD_REPOSITORY_TOKEN)
    private readonly uploadRepository: UploadRepository,
  ) {}

  async initiateUpload(
    payload: InitiateUploadDto,
  ): Promise<InitiateUploadResponseDto> {
    try {
      const { filename, filesize, userId } = payload;
      const maxFileSize = this.MAX_PARTS * this.PART_SIZE;

      if (filesize > maxFileSize) {
        throw new BadRequestException(
          `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024 * 1024)}GB`,
        );
      }

      const videoId = new ObjectId().toHexString();
      const s3Key = `uploads/${userId}/${videoId}/${filename}`;

      const { uploadId } = await this.s3Service.initiateMultipartUpload(
        s3Key,
        filename,
        this.PRESIGNED_URL_EXPIRATION,
      );

      const totalParts = Math.ceil(filesize / this.PART_SIZE);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + this.UPLOAD_EXPIRY_HOURS);

      await this.uploadRepository.createUploadSession({
        _id: new ObjectId(videoId),
        userId,
        filename,
        title: payload.title || '',
        originalName: filename,
        s3Key,
        size: filesize,
        uploadId,
        status: 'draft',
        processingStatus: 'pending',
        createdAt: new Date(),
        expiresAt: expiryDate,
      });

      return {
        videoId,
        uploadId,
        partCount: totalParts,
        partSize: this.PART_SIZE,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to initiate upload',
      );
    }
  }
  async getPartPresignedUrl(
    payload: GetPartPresignedUrlDto,
  ): Promise<PartPresignedUrlResponseDto> {
    try {
      if (!payload.videoId) {
        throw new BadRequestException('Video ID is required');
      }
      const uploadSession = await this.getUploadSession(
        payload.videoId,
        payload.userId as string,
      );
      const url = await this.s3Service.getSignedPartUrl(
        uploadSession.s3Key,
        uploadSession.uploadId,
        payload.partNumber,
        this.PRESIGNED_URL_EXPIRATION,
      );

      return {
        presignedUrl: url,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to get upload session',
      );
    }
  }

  async completeUpload(
    payload: CompleteUploadDto,
  ): Promise<CompleteUploadResponseDto> {
    try {
      if (!payload.videoId) {
        throw new BadRequestException('Video ID is required');
      }
      const uploadSession = await this.getUploadSession(
        payload.videoId,
        payload.userId as string,
      );

      await this.uploadRepository.updateUploadSession(payload.videoId, {
        processingStatus: 'completed',
        status: 'published',
      });

      const result = await this.s3Service.completeMultipartUpload(
        uploadSession.s3Key,
        uploadSession.uploadId,
        payload.parts,
      );

      return {
        videoId: payload.videoId,
        bucket: result.bucket,
        key: result.key,
        location: result.location,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to complete upload',
      );
    }
  }
  async cancelUpload(
    payload: CancelUploadDto,
  ): Promise<CancelUploadResponseDto> {
    try {
      if (!payload.videoId) {
        throw new BadRequestException('Video ID is required');
      }
      const uploadSession = await this.getUploadSession(
        payload.videoId,
        payload.userId as string,
      );
      await this.s3Service.abortMultipartUpload(
        uploadSession.s3Key,
        uploadSession.uploadId,
      );
      await this.uploadRepository.updateUploadSession(payload.videoId, {
        processingStatus: 'failed',
        status: 'archived',
      });

      return {
        status: 'cancelled',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to cancel upload',
      );
    }
  }

  private async getUploadSession(
    videoId: string,
    userId: string,
  ): Promise<Video> {
    try {
      const uploadSession = await this.uploadRepository.validateUploadSession(
        videoId,
        userId,
      );
      if (!uploadSession) {
        throw new NotFoundException('Upload session not found');
      }
      return uploadSession;
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to get upload session',
      );
    }
  }
}
