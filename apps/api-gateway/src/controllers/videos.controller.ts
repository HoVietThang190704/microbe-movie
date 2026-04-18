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

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  async uploadVideo(
    @Body() videoPayload: CreateVideoDto,
    @CurrentUser() user: JwtUser,
  ) {
    return await this.videosService.uploadVideo(videoPayload, user);
  }
}
