import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VIDEO_MODEL_TOKEN } from '../libs/shared/constant/videos';
import { Model } from 'mongoose';
import { Video } from '../database/entities/video.schema';

@Injectable()
export class UploadRepository {
  constructor(
    @InjectModel(VIDEO_MODEL_TOKEN) private readonly model: Model<Video>,
  ) {}
  async createUploadSession(videoData: Partial<Video>): Promise<Video> {
    const createdVideo = new this.model(videoData);
    return await createdVideo.save();
  }
  async updateUploadSession(
    id: string,
    updateData: Partial<Video>,
  ): Promise<Video | null> {
    return await this.model.findByIdAndUpdate(id, updateData).exec();
  }
  async validateUploadSession(
    videoId: string,
    userId: string,
  ): Promise<Video | null> {
    return await this.model.findOne({ _id: videoId, userId: userId }).exec();
  }
}
