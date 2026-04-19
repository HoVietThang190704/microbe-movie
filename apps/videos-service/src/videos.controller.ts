import { Controller, Inject, BadRequestException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { VIDEOS_MESSAGES } from '@libs/constants/videos';
import { CreateVideoDto } from '@libs';
import { VideosService } from './videos.service';
import { VIDEOS_SERVICE_TOKEN } from './libs/shared/constant/videos';

@Controller()
export class VideosController {
  constructor(
    @Inject(VIDEOS_SERVICE_TOKEN) private readonly videosService: VideosService,
  ) {}

  @MessagePattern(VIDEOS_MESSAGES.GET_VIDEOS)
  async getVideos() {
    return await this.videosService.getAllVideos();
  }

  @MessagePattern(VIDEOS_MESSAGES.CREATE_VIDEO)
  async createVideo(payload: CreateVideoDto) {
    if (!payload.userId) {
      throw new BadRequestException('userId is required for video upload');
    }
    return await this.videosService.createVideo(payload);
  }
}
