import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { VideoUploadRequest } from '@libs/types';
import { VIDEOS_MESSAGES } from '@libs/constants/videos';

@Controller()
export class VideosController {
  @MessagePattern(VIDEOS_MESSAGES.GET_VIDEOS)
  getVideos() {
    return {
      videos: [
        {
          id: '1',
          title: 'The Shawshank Redemption',
          filename: 'shawshank.mp4',
          size: 2147483648,
          uploadedAt: new Date('2024-01-01'),
        },
      ],
      total: 1,
    };
  }

  @MessagePattern(VIDEOS_MESSAGES.UPLOAD_VIDEO)
  uploadVideo(payload: VideoUploadRequest) {
    return {
      id: '2',
      filename: payload.filename,
      originalName: payload.originalName,
      size: payload.size,
      uploadedAt: new Date(),
      url: `/videos/${payload.filename}`,
    };
  }
}
