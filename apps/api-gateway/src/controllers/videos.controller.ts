import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ResponseInterceptor } from '../intercepter/ResponseIntercepter';
import type { GetVideosData } from '@libs/types';

@Controller('/api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  async getVideos(): Promise<GetVideosData> {
    return await this.videosService.getVideos();
  }
}
