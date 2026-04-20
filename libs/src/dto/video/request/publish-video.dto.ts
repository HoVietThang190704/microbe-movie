import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';

export class PublishVideoDto {
  @IsString({ message: 'Video ID must be a string' })
  videoId!: string;

  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isPublic must be a boolean' })
  isPublic?: boolean;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
}
