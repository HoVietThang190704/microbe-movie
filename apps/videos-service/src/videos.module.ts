import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import {
  VIDEOS_REPOSITORY_TOKEN,
  VIDEOS_SERVICE_TOKEN,
} from './libs/shared/constant/videos';
import { VideosService } from './videos.service';
import { VideosRepository } from './videos.repository';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './database/config/database.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [VideosController],
  providers: [
    {
      provide: VIDEOS_SERVICE_TOKEN,
      useClass: VideosService,
    },
    {
      provide: VIDEOS_REPOSITORY_TOKEN,
      useClass: VideosRepository,
    },
  ],
})
export class VideosModule {}
