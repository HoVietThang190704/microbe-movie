import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ResponseInterceptor } from '../intercepter/ResponseIntercepter';
import type { GetVideosData } from '@libs/types';

@Controller('/api/videos')
@UseInterceptors(ResponseInterceptor)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async getVideos(): Promise<GetVideosData> {
    return await this.videosService.getVideos();
  }
}
