import { APIRequestContext } from '@playwright/test';

interface InitiateUploadResponse {
  videoId: string;
  uploadId: string;
  partCount: number;
  partSize: number;
}

export async function initiateUpload(
  request: APIRequestContext,
  filename: string,
  filesize: number,
): Promise<InitiateUploadResponse> {
  const response = await request.post(
    'http://localhost:3000/api/videos/initiate-upload',
    {
      data: {
        filename,
        title: filename.replace('.mp4', ''),
        description: 'Test video upload',
        filesize,
      },
    },
  );

  return (await response.json()) as InitiateUploadResponse;
}
