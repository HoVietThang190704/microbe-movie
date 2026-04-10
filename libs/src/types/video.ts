export interface VideoUploadData {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

export interface GetVideosData {
  videos: Array<{
    id: string;
    title: string;
    filename: string;
    size: number;
    uploadedAt: Date;
  }>;
  total: number;
}
