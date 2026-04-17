import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { VideosService } from '../services/videos.service';
import { ResponseInterceptor } from '../intercepter/ResponseIntercepter';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUser } from '../auth/types/jwt-user.interface';
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
