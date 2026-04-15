import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import 'tsconfig-paths/register';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { NestFactory } from '@nestjs/core';
import { USER_ENV, DEFAULT_HOSTS, DEFAULT_PORTS } from '@libs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env[USER_ENV.HOST] ?? DEFAULT_HOSTS.LOCALHOST,
        port: parseInt(
          process.env[USER_ENV.PORT] ?? DEFAULT_PORTS.USER_SERVICE.toString(),
          10,
        ),
      },
    },
  );
  await app.listen();
}
bootstrap();
