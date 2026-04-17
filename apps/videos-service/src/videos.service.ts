import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from '@libs';
import { VideosRepository } from './videos.repository';
import { VIDEOS_REPOSITORY_TOKEN } from './libs/shared/constant/videos';
import { Video } from './database/entities/video.schema';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_REPOSITORY_TOKEN)
    private readonly videosRepository: VideosRepository,
  ) {}

  async getAllVideos(count: number = 10): Promise<Video[]> {
    return this.videosRepository.getAllVideos(count);
  }

  async getVideoById(id: string): Promise<Video | null> {
    return this.videosRepository.getVideoById(id);
  }

  async createVideo(videoData: CreateVideoDto): Promise<Video> {
    try {
      return await this.videosRepository.createVideo(videoData);
    } catch {
      throw new InternalServerErrorException('Failed to create video');
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

  private mapToVideoResponseDto(video: Partial<Video>): Video {
    return {
      title: video.title!,
      filename: video.filename!,
      originalName: video.originalName!,
      size: video.size!,
      uploadedBy: video.uploadedBy || 'Unknown',
      userId: video.userId!,
      description: video.description || '',
      isActive: video.isActive ?? true,
      createdAt: video.createdAt || new Date(),
      updatedAt: video.updatedAt || new Date(),
    };
  }
}
