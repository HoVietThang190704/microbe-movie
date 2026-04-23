import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VideosController } from './videos.controller';
import {
  S3_SERVICE_TOKEN,
  UPLOAD_REPOSITORY_TOKEN,
  UPLOAD_SERVICE_TOKEN,
  VIDEOS_REPOSITORY_TOKEN,
  VIDEOS_SERVICE_TOKEN,
} from './libs/shared/constant/videos';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './database/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { VideosService } from './services/videos.service';
import { VideosRepository } from './respository/videos.repository';
import { S3Service } from './services/s3.service';
import { UploadService } from './services/upload.service';
import { UploadRepository } from './respository/upload.repository';
import s3Config from './config/s3.config';
import {
  RABBITMQ_QUEUES,
  RABBITMQ_URL_DEFAULT,
  RABBITMQ_OPTIONS,
} from '@libs/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, s3Config],
      envFilePath: '.env',
    }),
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT],
          queue: RABBITMQ_QUEUES.USER,
          queueOptions: RABBITMQ_OPTIONS,
        },
      },
    ]),
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
    {
      provide: S3_SERVICE_TOKEN,
      useClass: S3Service,
    },
    {
      provide: UPLOAD_SERVICE_TOKEN,
      useClass: UploadService,
    },
    {
      provide: UPLOAD_REPOSITORY_TOKEN,
      useClass: UploadRepository,
    },
  ],
})
export class VideosModule {}
