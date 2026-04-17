import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import {
  VIDEOS_REPOSITORY_TOKEN,
  VIDEOS_SERVICE_TOKEN,
} from './libs/shared/constant/videos';
import { VideosService } from './videos.service';
import { VideosRepository } from './videos.repository';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [
    {
      provide: VIDEOS_SERVICE_TOKEN,
      useValue: VideosService,
    },
    {
      provide: VIDEOS_REPOSITORY_TOKEN,
      useValue: VideosRepository,
    },
  ],
})
export class VideosModule {}
