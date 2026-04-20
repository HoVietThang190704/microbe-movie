import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from '../database/entities/video.schema';
import { VIDEO_MODEL_TOKEN } from '../libs/shared/constant/videos';

@Injectable()
export class VideosRepository {
  constructor(
    @InjectModel(VIDEO_MODEL_TOKEN) private readonly model: Model<Video>,
  ) {}
  async getAllVideos(count: number = 10): Promise<Video[]> {
    return this.model.aggregate<Video>([{ $sample: { size: count } }]).exec();
  }

  async getVideoById(id: string): Promise<Video | null> {
    return this.model.findById(id).exec();
  }

  async createVideo(videoData: Partial<Video>): Promise<Video> {
    const createdVideo = new this.model(videoData);
    return createdVideo.save();
  }

  async deleteVideo(id: string): Promise<Video | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async updateVideo(
    id: string,
    updateData: Partial<Video>,
  ): Promise<Video | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}
