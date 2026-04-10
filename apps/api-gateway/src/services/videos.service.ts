import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { VIDEOS_SERVICE_TOKEN, VIDEOS_MESSAGES } from '@libs/constants';
import type { GetVideosData, VideoUploadData } from '@libs/types';
import { CreateVideoDto } from '@libs';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_SERVICE_TOKEN) private videosClient: ClientProxy,
  ) {}

  private async send<TRequest, TResponse>(
    pattern: string,
    payload: TRequest,
  ): Promise<TResponse> {
    return await firstValueFrom(this.videosClient.send(pattern, payload));
  }

  async getVideos(): Promise<GetVideosData> {
    return this.send<object, GetVideosData>(VIDEOS_MESSAGES.GET_VIDEOS, {});
  }

  async uploadVideo(payload: CreateVideoDto): Promise<VideoUploadData> {
    return this.send<CreateVideoDto, VideoUploadData>(
      VIDEOS_MESSAGES.UPLOAD_VIDEO,
      payload,
    );
  }
}
