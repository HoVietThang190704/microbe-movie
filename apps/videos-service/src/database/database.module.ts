import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './entities/video.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017',
      {
        dbName: process.env.DB_NAME || 'videos_db',
      },
    ),
    MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
