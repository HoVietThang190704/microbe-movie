import { test, expect } from './fixtures/auth.fixture';
import { initiateUpload } from '../helpers/test-utils';

interface CompleteUploadResponse {
  videoId: string;
  location: string;
  bucket?: string;
  key?: string;
}

interface VideoItem {
  _id: string;
  title: string;
  filename: string;
  userId: string;
}

type GetVideosResponse = VideoItem[];

test.describe('Video Upload E2E Flow', () => {
  let videoId: string;
  let uploadId: string;

  test('Should initiate video upload', async ({ authenticatedRequest }) => {
    const result = await initiateUpload(
      authenticatedRequest,
      'test-video.mp4',
      52428800,
    );

    expect(result.videoId).toBeTruthy();
    expect(result.uploadId).toBeTruthy();
    expect(result.partSize).toBeGreaterThan(0);
    expect(result.partCount).toBeGreaterThan(0);

    videoId = result.videoId;
    uploadId = result.uploadId;
  });

  test('Should complete upload', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.post(
      `http://localhost:3000/api/videos/${videoId}/complete-upload`,
      {
        data: {
          uploadId,
          parts: [
            { PartNumber: 1, ETag: '"abc123"' },
            { PartNumber: 2, ETag: '"def456"' },
            { PartNumber: 3, ETag: '"ghi789"' },
          ],
        },
      },
    );

    expect(response.status()).toBe(200);
    const data = (await response.json()) as CompleteUploadResponse;
    expect(data.videoId).toBeTruthy();
    expect(data.location).toBeTruthy();
  });

  test('Should publish video', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.put(
      `http://localhost:3000/api/videos/${videoId}/publish`,
      {
        data: {
          title: 'My Uploaded Video Test',
          description: 'Test video upload',
          tags: ['test', 'video'],
          isPublic: true,
        },
      },
    );

    expect(response.status()).toBe(200);
  });

  test('Should get all videos', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get(
      'http://localhost:3000/api/videos',
    );

    expect(response.status()).toBe(200);
    const videos = (await response.json()) as GetVideosResponse;
    expect(Array.isArray(videos)).toBe(true);
  });
});
