export const VIDEOS_SERVICE_TOKEN = 'VIDEOS_SERVICE';

export const VIDEOS_MESSAGES = {
  GET_VIDEOS: 'get_videos',
} as const;

export const VIDEOS_ENV = {
  HOST: 'VIDEOS_HOST',
  PORT: 'VIDEOS_PORT',
} as const;

export const DEFAULT_PORTS = {
  API_GATEWAY: 8080,
  VIDEOS_SERVICE: 8081,
} as const;

export const DEFAULT_HOSTS = {
  LOCALHOST: 'localhost',
} as const;
