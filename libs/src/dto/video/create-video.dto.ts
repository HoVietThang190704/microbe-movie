import { IsEnum, IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export const VideoMimeType = {
  MP4: 'video/mp4',
  QUICKTIME: 'video/quicktime',
  AVI: 'video/x-msvideo',
} as const;

export type VideoMimeType = (typeof VideoMimeType)[keyof typeof VideoMimeType];

export class CreateVideoDto {
  @IsString()
  title!: string;

  @IsString()
  filename!: string;

  @IsString()
  originalName!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(1)
  size!: number;

  @IsString()
  path!: string;

  @IsEnum(VideoMimeType)
  mimetype!: VideoMimeType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId?: string;
}
