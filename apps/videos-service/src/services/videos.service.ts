import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from '@libs';
import { VIDEOS_REPOSITORY_TOKEN } from '../libs/shared/constant/videos';
import { Video } from '../database/entities/video.schema';
import { VideosRepository } from '../respository/videos.repository';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_REPOSITORY_TOKEN)
    private readonly videosRepository: VideosRepository,
  ) {}

  async getAllVideos(count: number = 10): Promise<Video[]> {
    try {
      return await this.videosRepository.getAllVideos(count);
    } catch (error) {
      console.error('Error retrieving videos:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to retrieve videos',
      );
    }
  }

  async getVideoById(id: string): Promise<Video | null> {
    try {
      return await this.videosRepository.getVideoById(id);
    } catch (error) {
      console.error('Error retrieving video:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to retrieve video',
      );
    }
  }

  async createVideo(videoData: CreateVideoDto): Promise<Video> {
    try {
      return await this.videosRepository.createVideo(videoData);
    } catch (error) {
      console.error('Error creating video:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to create video',
      );
    }
  }

  async deleteVideo(id: string): Promise<Video | null> {
    const deletedVideo = await this.videosRepository.deleteVideo(id);
    if (!deletedVideo) {
      throw new NotFoundException(`Video with id ${id} not found`);
    }
    return deletedVideo;
  }

  async updateVideo(
    id: string,
    updateData: Partial<Video>,
  ): Promise<Video | null> {
    const updatedVideo = await this.videosRepository.updateVideo(
      id,
      updateData,
    );
    if (!updatedVideo) {
      throw new NotFoundException(`Video with id ${id} not found`);
    }
    return updatedVideo;
  }
}
