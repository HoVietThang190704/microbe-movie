export class PublishVideoResponseDto {
  id!: string;
  userId!: string;
  title!: string;
  filename!: string;
  size!: number;
  status!: string;
  uploadStatus!: string;
  isPublic!: boolean;
  publishedAt!: Date;
  createdAt!: Date;
}
