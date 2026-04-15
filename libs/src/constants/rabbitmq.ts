export const RABBITMQ_URL_DEFAULT = 'amqp://guest:guest@localhost:5672';

export const RABBITMQ_QUEUES = {
  USER: 'user_queue',
  AUTH: 'auth_queue',
  VIDEOS: 'videos_queue',
} as const;

export const RABBITMQ_OPTIONS = {
  durable: true,
} as const;

export const RABBITMQ_PORTS = {
  USER: 8083,
  AUTH: 8082,
  VIDEOS: 8081,
  GATEWAY: 8080,
} as const;

export type RabbitMQQueue =
  (typeof RABBITMQ_QUEUES)[keyof typeof RABBITMQ_QUEUES];
