import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [],
})
export class VideosModule {}
