import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';

export class PartEtagDto {
  @IsNumber({}, { message: 'Part number must be a number' })
  @Min(1, { message: 'Part number must be >= 1' })
  PartNumber!: number;

  @IsString({ message: 'ETag must be a string' })
  ETag!: string;
}

export class CompleteUploadDto {
  @IsOptional()
  @IsString({ message: 'Video ID must be a string' })
  videoId?: string;

  @IsString({ message: 'Upload ID must be a string' })
  uploadId!: string;

  @IsArray({ message: 'Parts must be an array' })
  @ArrayMinSize(1, { message: 'At least one part is required' })
  @ValidateNested({ each: true })
  @Type(() => PartEtagDto)
  parts!: PartEtagDto[];

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
}
