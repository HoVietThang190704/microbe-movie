import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetVideosResponseDto, USER_MESSAGES } from '@libs';
import { VideosRepository } from './respository/videos.repository';
import { VIDEOS_REPOSITORY_TOKEN } from './libs/shared/constant/videos';
import { Video } from './database/entities/video.schema';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_REPOSITORY_TOKEN)
    private readonly videosRepository: VideosRepository,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getAllVideos(count: number = 10): Promise<GetVideosResponseDto[]> {
    try {
      const videos = await this.videosRepository.getAllVideos(count);
      const videosWithUserInfo = await Promise.all(
        videos.map(async (video: Video) => {
          try {
            const userInfo = await this.userClient
              .send(USER_MESSAGES.GET_USER_BY_ID, { id: video.userId })
              .toPromise();

            return {
              ...video,
              _id: video._id?.toString?.() || video._id,
              userInfo: userInfo
                ? {
                    username: userInfo.username,
                  }
                : undefined,
            };
          } catch (error) {
            console.error(
              `Failed to fetch user info for userId ${video.userId}:`,
              error,
            );
            return {
              ...video,
              _id: video._id?.toString?.() || video._id,
              userInfo: undefined,
            };
          }
        }),
      );

      return videosWithUserInfo as GetVideosResponseDto[];
    } catch (error) {
      console.error('Error retrieving videos:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to retrieve videos',
      );
    }
  }

  async getVideoById(id: string): Promise<GetVideosResponseDto | null> {
    try {
      const video = await this.videosRepository.getVideoById(id);
      if (!video) {
        return null;
      }

      try {
        const userInfo = await this.userClient
          .send(USER_MESSAGES.GET_USER_BY_ID, { id: video.userId })
          .toPromise();

        return {
          ...video,
          _id: video._id?.toString?.() || video._id,
          userInfo: userInfo
            ? {
                username: userInfo.username,
              }
            : undefined,
        } as GetVideosResponseDto;
      } catch (error) {
        console.error(
          `Failed to fetch user info for userId ${video.userId}:`,
          error,
        );
        return {
          ...video,
          _id: video._id?.toString?.() || video._id,
          userInfo: undefined,
        } as GetVideosResponseDto;
      }
    } catch (error) {
      console.error('Error retrieving video:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to retrieve video',
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
