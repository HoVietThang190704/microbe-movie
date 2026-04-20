import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetPartPresignedUrlDto {
  @IsOptional()
  @IsString({ message: 'Video ID must be a string' })
  videoId?: string;

  @IsNumber({}, { message: 'Part number must be a number' })
  @Min(1, { message: 'Part number must be >= 1' })
  partNumber!: number;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
}
