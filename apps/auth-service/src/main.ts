import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'apps/auth-service/.env') });

import 'tsconfig-paths/register';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { NestFactory } from '@nestjs/core';
import {
  RABBITMQ_QUEUES,
  RABBITMQ_OPTIONS,
  RABBITMQ_URL_DEFAULT,
} from '@libs/constants';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: RABBITMQ_QUEUES.AUTH,
        queueOptions: RABBITMQ_OPTIONS,
      },
    },
  );
  await app.listen();
  console.log(`Auth Service listening on RabbitMQ queue: ${RABBITMQ_QUEUES.AUTH}`);
}
bootstrap();
