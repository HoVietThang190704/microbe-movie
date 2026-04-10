import { Controller, Get } from '@nestjs/common';
import { VideosService } from '../services/videos.service';

@Controller('/api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async getVideos() {
    return await this.videosService.getVideos();
  }
}
