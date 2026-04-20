import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class InitiateUploadDto {
  @IsString({ message: 'Filename must be a string' })
  @MinLength(1, { message: 'Filename is required' })
  @MaxLength(255, { message: 'Filename must not exceed 255 characters' })
  filename!: string;

  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title!: string;

  @IsNumber({}, { message: 'File size must be a number' })
  @Min(1, { message: 'File size must be greater than 0' })
  filesize!: number;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  @MinLength(1, { message: 'User ID is required' })
  userId?: string;
}
