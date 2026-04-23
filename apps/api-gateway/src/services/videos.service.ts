import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VIDEOS_SERVICE_TOKEN, VIDEOS_MESSAGES } from '@libs/constants';
import type { GetVideosData } from '@libs/types';
import {
  InitiateUploadDto,
  GetPartPresignedUrlDto,
  CompleteUploadDto,
  CancelUploadDto,
  PublishVideoDto,
  InitiateUploadResponseDto,
  PartPresignedUrlResponseDto,
  CompleteUploadResponseDto,
  CancelUploadResponseDto,
  PublishVideoResponseDto,
  handleMicroserviceCall,
} from '@libs';
import { JwtUser } from '../auth/types/jwt-user.interface';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_SERVICE_TOKEN) private videosClient: ClientProxy,
  ) {}

  async getVideos(): Promise<GetVideosData> {
    return handleMicroserviceCall<object, GetVideosData>(
      this.videosClient,
      VIDEOS_MESSAGES.GET_VIDEOS,
      {},
    );
  }

  async initiateUpload(
    payload: InitiateUploadDto,
    user: JwtUser,
  ): Promise<InitiateUploadResponseDto> {
    const dto: InitiateUploadDto = {
      ...payload,
      userId: user.userId,
    };

    return handleMicroserviceCall<InitiateUploadDto, InitiateUploadResponseDto>(
      this.videosClient,
      VIDEOS_MESSAGES.INITIATE_UPLOAD,
      dto,
    );
  }

  async getPartPresignedUrl(
    videoId: string,
    partNumber: number,
    user: JwtUser,
  ): Promise<PartPresignedUrlResponseDto> {
    const dto: GetPartPresignedUrlDto = {
      videoId,
      partNumber,
      userId: user.userId,
    };

    return handleMicroserviceCall<
      GetPartPresignedUrlDto,
      PartPresignedUrlResponseDto
    >(this.videosClient, VIDEOS_MESSAGES.GET_PART_PRESIGNED_URL, dto);
  }

  async completeUpload(
    videoId: string,
    uploadId: string,
    parts: { PartNumber: number; ETag: string }[],
    user: JwtUser,
  ): Promise<CompleteUploadResponseDto> {
    const dto: CompleteUploadDto = {
      videoId,
      uploadId,
      parts,
      userId: user.userId,
    };

    return handleMicroserviceCall<CompleteUploadDto, CompleteUploadResponseDto>(
      this.videosClient,
      VIDEOS_MESSAGES.COMPLETE_UPLOAD,
      dto,
    );
  }

  async cancelUpload(
    videoId: string,
    user: JwtUser,
  ): Promise<CancelUploadResponseDto> {
    const dto: CancelUploadDto = {
      videoId,
      userId: user.userId,
    };

    return handleMicroserviceCall<CancelUploadDto, CancelUploadResponseDto>(
      this.videosClient,
      VIDEOS_MESSAGES.CANCEL_UPLOAD,
      dto,
    );
  }

  async publishVideo(
    videoId: string,
    title: string,
    description: string | undefined,
    tags: string[] | undefined,
    isPublic: boolean | undefined,
    user: JwtUser,
  ): Promise<PublishVideoResponseDto> {
    const dto: PublishVideoDto = {
      videoId,
      userId: user.userId,
      title,
      description,
      tags,
      isPublic,
    };

    return handleMicroserviceCall<PublishVideoDto, PublishVideoResponseDto>(
      this.videosClient,
      VIDEOS_MESSAGES.PUBLISH_VIDEO,
      dto,
    );
  }
}
