export const VIDEOS_SERVICE_TOKEN = 'VIDEOS_SERVICE';

export const VIDEOS_MESSAGES = {
  GET_VIDEOS: 'get_videos',
  INITIATE_UPLOAD: 'initiate_upload',
  GET_PART_PRESIGNED_URL: 'get_part_presigned_url',
  COMPLETE_UPLOAD: 'complete_upload',
  CANCEL_UPLOAD: 'cancel_upload',
  PUBLISH_VIDEO: 'publish_video',
} as const;

export const VIDEOS_ENV = {
  HOST: 'VIDEOS_HOST',
  PORT: 'VIDEOS_PORT',
} as const;
