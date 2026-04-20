import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ResponseInterceptor } from '../intercepter/ResponseIntercepter';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import type { GetVideosData } from '@libs/types';
import {
  CreateVideoDto,
  PublishVideoDto,
  InitiateUploadResponseDto,
  PartPresignedUrlResponseDto,
  CompleteUploadResponseDto,
  CancelUploadResponseDto,
  PublishVideoResponseDto,
  GetPartPresignedUrlDto,
  InitiateUploadDto,
  CompleteUploadDto,
} from '@libs';
import { JwtUser } from '../auth/types/jwt-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('/api/videos')
@UseInterceptors(ResponseInterceptor)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async getVideos(): Promise<GetVideosData> {
    return await this.videosService.getVideos();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createVideo(
    @Body() videoPayload: CreateVideoDto,
    @CurrentUser() user: JwtUser,
  ) {
    return await this.videosService.createVideo(videoPayload, user);
  }

  @Post('initiate-upload')
  @UseGuards(JwtAuthGuard)
  async initiateUpload(
    @Body() dto: InitiateUploadDto,
    @CurrentUser() user: JwtUser,
  ): Promise<InitiateUploadResponseDto> {
    return await this.videosService.initiateUpload(dto, user);
  }

  @Post(':id/part-presigned-url')
  @UseGuards(JwtAuthGuard)
  async getPartPresignedUrl(
    @Param('id') videoId: string,
    @Body() dto: GetPartPresignedUrlDto,
    @CurrentUser() user: JwtUser,
  ): Promise<PartPresignedUrlResponseDto> {
    return await this.videosService.getPartPresignedUrl(
      videoId,
      dto.partNumber,
      user,
    );
  }

  @Post(':id/complete-upload')
  @UseGuards(JwtAuthGuard)
  async completeUpload(
    @Param('id') videoId: string,
    @Body()
    dto: CompleteUploadDto,
    @CurrentUser() user: JwtUser,
  ): Promise<CompleteUploadResponseDto> {
    return await this.videosService.completeUpload(
      videoId,
      dto.uploadId,
      dto.parts,
      user,
    );
  }

  @Post(':id/cancel-upload')
  @UseGuards(JwtAuthGuard)
  async cancelUpload(
    @Param('id') videoId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<CancelUploadResponseDto> {
    if (!videoId) {
      throw new BadRequestException('Video ID is required');
    }
    return await this.videosService.cancelUpload(videoId, user);
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishVideo(
    @Param('id') videoId: string,
    @Body() dto: PublishVideoDto,
    @CurrentUser() user: JwtUser,
  ): Promise<PublishVideoResponseDto> {
    return await this.videosService.publishVideo(
      videoId,
      dto.title,
      dto.description,
      dto.tags,
      dto.isPublic,
      user,
    );
  }
}
