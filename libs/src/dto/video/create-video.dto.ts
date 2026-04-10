import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export const VideoMimeType = {
  MP4: 'video/mp4',
  QUICKTIME: 'video/quicktime',
  AVI: 'video/x-msvideo',
} as const;

export type VideoMimeType = (typeof VideoMimeType)[keyof typeof VideoMimeType];

export class CreateVideoDto {
  @IsString()
  filename!: string;

  @IsString()
  originalName!: string;

  @IsString()
  path!: string;

  @IsNumber()
  @Min(1)
  size!: number;

  @IsEnum(VideoMimeType)
  mimetype!: VideoMimeType;
}
