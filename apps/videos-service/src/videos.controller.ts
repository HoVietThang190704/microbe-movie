import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { VIDEOS_MESSAGES } from './constants';

@Controller()
export class VideosController {
  @MessagePattern(VIDEOS_MESSAGES.GET_VIDEOS)
  getVideos() {
    return [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        year: 1994,
      },
    ];
  }
}
