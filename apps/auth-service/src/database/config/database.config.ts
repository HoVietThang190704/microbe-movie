import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [UserEntity],
        migrations: ['dist/database/migrations/**/*.js'],
        synchronize: false,
        logging: isDevelopment,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
      };
    }

    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'auth_db',
      entities: [UserEntity],
      migrations: ['dist/database/migrations/**/*.js'],
      synchronize: false,
      logging: isDevelopment,
    };
  },
);
