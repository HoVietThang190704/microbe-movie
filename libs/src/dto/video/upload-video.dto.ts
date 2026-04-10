import { IsString, IsNumber, MinLength, MaxLength, Min } from 'class-validator';

export class UploadVideoDto {
  @IsString({ message: 'Filename must be a string' })
  @MinLength(1, { message: 'Filename is required' })
  @MaxLength(255, { message: 'Filename must not exceed 255 characters' })
  filename: string;

  @IsString({ message: 'Original name must be a string' })
  @MinLength(1, { message: 'Original name is required' })
  @MaxLength(255, { message: 'Original name must not exceed 255 characters' })
  originalName: string;

  @IsNumber({}, { message: 'Size must be a number' })
  @Min(1, { message: 'Size must be greater than 0' })
  size: number;
}
