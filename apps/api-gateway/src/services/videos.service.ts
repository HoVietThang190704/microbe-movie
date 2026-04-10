import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { VIDEOS_SERVICE_TOKEN, VIDEOS_MESSAGES } from '../constants';

@Injectable()
export class VideosService {
  constructor(
    @Inject(VIDEOS_SERVICE_TOKEN) private videosClient: ClientProxy,
  ) {}

  async getVideos() {
    return await firstValueFrom(
      this.videosClient.send(VIDEOS_MESSAGES.GET_VIDEOS, {}),
    );
  }
}
