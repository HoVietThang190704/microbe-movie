import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VideoSchema } from './entities/video.schema';
import { databaseConfig } from './config/database.config';
import { VIDEO_MODEL_TOKEN } from '../libs/shared/constant/videos';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUrl =
          configService.get<string>('MONGO_URL') || 'mongodb://localhost:27017';
        const dbName = configService.get<string>('DB_NAME') || 'videos_db';

        return {
          uri: mongoUrl,
          dbName: dbName,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: VIDEO_MODEL_TOKEN, schema: VideoSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
