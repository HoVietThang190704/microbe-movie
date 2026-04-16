export const USER_SERVICE_TOKEN = 'USER_SERVICE';
export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY';

export const USER_MESSAGES = {
  CREATE: 'user_create',
  FIND_EMAIL: 'user_find_email',
  GET_USER_BY_ID: 'user_get_by_id',
  UPDATE_USER: 'user_update',
  DELETE_USER: 'user_delete',
} as const;

export const USER_ENV = {
  HOST: 'USER_HOST',
  PORT: 'USER_PORT',
} as const;
