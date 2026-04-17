import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VIDEOS_SERVICE_TOKEN, VIDEOS_MESSAGES } from '@libs/constants';
import type { GetVideosData, VideoUploadData } from '@libs/types';
import { CreateVideoDto, handleMicroserviceCall } from '@libs';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_SERVICE_TOKEN) private videosClient: ClientProxy,
  ) {}

  async getVideos(): Promise<GetVideosData> {
    return handleMicroserviceCall<object, GetVideosData>(
      this.videosClient,
      VIDEOS_MESSAGES.GET_VIDEOS,
      {},
    );
  }

  async uploadVideo(payload: CreateVideoDto): Promise<VideoUploadData> {
    return handleMicroserviceCall<CreateVideoDto, VideoUploadData>(
      this.videosClient,
      VIDEOS_MESSAGES.UPLOAD_VIDEO,
      payload,
    );
  }
}
