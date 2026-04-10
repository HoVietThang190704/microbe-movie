export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE';

export const AUTH_MESSAGES = {
  REGISTER: 'auth_register',
  LOGIN: 'auth_login',
  VALIDATE_TOKEN: 'auth_validate_token',
  REFRESH_TOKEN: 'auth_refresh_token',
} as const;

export const AUTH_ENV = {
  HOST: 'AUTH_HOST',
  PORT: 'AUTH_PORT',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
} as const;
