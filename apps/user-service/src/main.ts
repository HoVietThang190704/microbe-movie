import * as dotenv from 'dotenv';
import * as path from 'path';

// Load from root .env first
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Then load from service-specific .env (overrides root)
dotenv.config({ path: path.join(process.cwd(), 'apps/user-service/.env') });

import 'tsconfig-paths/register';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { NestFactory } from '@nestjs/core';
import {
  RABBITMQ_QUEUES,
  RABBITMQ_OPTIONS,
  RABBITMQ_URL_DEFAULT,
} from '@libs/constants';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: RABBITMQ_QUEUES.USER,
        queueOptions: RABBITMQ_OPTIONS,
      },
    },
  );
  await app.listen();
  console.log(
    `User Service listening on RabbitMQ queue: ${RABBITMQ_QUEUES.USER}`,
  );
}
bootstrap();
