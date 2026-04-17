import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = registerAs(
  'database',
  (): MongooseModuleOptions => {
    const databaseUrl = process.env.MONGO_URL;

    return {
      uri: databaseUrl,
      dbName: process.env.DB_NAME,
      auth: {
        username: process.env.MONGOUSER,
        password: process.env.MONGOPASSWORD,
      },
    };
  },
);
