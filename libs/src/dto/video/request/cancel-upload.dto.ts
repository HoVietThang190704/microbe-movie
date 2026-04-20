import { IsString, IsOptional } from 'class-validator';

export class CancelUploadDto {
  @IsString({ message: 'Video ID must be a string' })
  videoId!: string;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
}
