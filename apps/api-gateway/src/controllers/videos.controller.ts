import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ResponseInterceptor } from '../intercepter/ResponseIntercepter';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import type { GetVideosData } from '@libs/types';
import { CreateVideoDto } from '../constants';

@Controller('/api/videos')
@UseInterceptors(ResponseInterceptor)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async getVideos(): Promise<GetVideosData> {
    return await this.videosService.getVideos();
  }

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  async uploadVideo(@Body() videoPayload: CreateVideoDto) {
    return await this.videosService.uploadVideo(videoPayload);
  }
}
