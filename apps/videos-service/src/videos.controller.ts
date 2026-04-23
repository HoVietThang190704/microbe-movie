import { Controller, Inject, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VIDEOS_MESSAGES } from '@libs/constants/videos';
import {
  InitiateUploadDto,
  GetPartPresignedUrlDto,
  CompleteUploadDto,
  CancelUploadDto,
  InitiateUploadResponseDto,
  PartPresignedUrlResponseDto,
  CompleteUploadResponseDto,
  CancelUploadResponseDto,
} from '@libs';
import {
  UPLOAD_SERVICE_TOKEN,
  VIDEOS_SERVICE_TOKEN,
} from './libs/shared/constant/videos';
import { VideosService } from './services/videos.service';
import { UploadService } from './services/upload.service';

@Controller()
export class VideosController {
  constructor(
    @Inject(VIDEOS_SERVICE_TOKEN)
    private readonly videosService: VideosService,
    @Inject(UPLOAD_SERVICE_TOKEN) private readonly uploadService: UploadService,
  ) {}

  @MessagePattern(VIDEOS_MESSAGES.GET_VIDEOS)
  async getVideos() {
    return await this.videosService.getAllVideos();
  }

  @MessagePattern(VIDEOS_MESSAGES.INITIATE_UPLOAD)
  async initiateUpload(
    @Payload() payload: InitiateUploadDto,
  ): Promise<InitiateUploadResponseDto> {
    if (!payload.userId) {
      throw new BadRequestException('userId is required for upload initiation');
    }
    return await this.uploadService.initiateUpload(payload);
  }

  @MessagePattern(VIDEOS_MESSAGES.GET_PART_PRESIGNED_URL)
  async getPartPresignedUrl(
    @Payload() payload: GetPartPresignedUrlDto,
  ): Promise<PartPresignedUrlResponseDto> {
    if (!payload.userId) {
      throw new BadRequestException(
        'userId is required for getting presigned URL',
      );
    }
    return await this.uploadService.getPartPresignedUrl(payload);
  }

  @MessagePattern(VIDEOS_MESSAGES.COMPLETE_UPLOAD)
  async completeUpload(
    @Payload() payload: CompleteUploadDto,
  ): Promise<CompleteUploadResponseDto> {
    if (!payload.userId) {
      throw new BadRequestException('userId is required for completing upload');
    }
    return await this.uploadService.completeUpload(payload);
  }

  @MessagePattern(VIDEOS_MESSAGES.CANCEL_UPLOAD)
  async cancelUpload(
    @Payload() payload: CancelUploadDto,
  ): Promise<CancelUploadResponseDto> {
    if (!payload.userId) {
      throw new BadRequestException('userId is required for cancelling upload');
    }
    return await this.uploadService.cancelUpload(payload);
  }

  // @MessagePattern(VIDEOS_MESSAGES.PUBLISH_VIDEO)
  // async publishVideo(
  //   @Payload() payload: PublishVideoDto,
  // ): Promise<PublishVideoResponseDto> {
  //   if (!payload.userId) {
  //     throw new BadRequestException('userId is required for publishing video');
  //   }
  //   return await this.videosService.publishVideo(payload);
  // }
}
