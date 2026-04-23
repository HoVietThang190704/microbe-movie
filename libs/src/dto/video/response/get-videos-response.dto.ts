export class VideoUserInfoDto {
  username!: string;
}

export class GetVideosResponseDto {
  _id!: string;
  title!: string;
  filename!: string;
  originalName!: string;
  description?: string;
  tags?: string[];
  category?: string;
  userId!: string;
  uploadId!: string;
  size!: number;
  s3Key!: string;
  status!: 'draft' | 'published' | 'archived';
  processingStatus!: 'pending' | 'processing' | 'completed' | 'failed';
  userInfo?: VideoUserInfoDto;
  createdAt?: Date;
  updatedAt?: Date;
}
