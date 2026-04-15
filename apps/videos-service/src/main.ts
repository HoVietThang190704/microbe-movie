import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { VideosModule } from './videos.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  RABBITMQ_QUEUES,
  RABBITMQ_OPTIONS,
  RABBITMQ_URL_DEFAULT,
} from '@libs/constants';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    VideosModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: RABBITMQ_QUEUES.VIDEOS,
        queueOptions: RABBITMQ_OPTIONS,
      },
    },
  );
  await app.listen();
  console.log(`Videos Service listening on RabbitMQ queue: ${RABBITMQ_QUEUES.VIDEOS}`);
}
bootstrap();
