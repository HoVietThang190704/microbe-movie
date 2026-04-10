import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { VideosModule } from './videos.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { VIDEOS_ENV, DEFAULT_PORTS, DEFAULT_HOSTS } from '@libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    VideosModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env[VIDEOS_ENV.HOST] ?? DEFAULT_HOSTS.LOCALHOST,
        port: parseInt(
          process.env[VIDEOS_ENV.PORT] ??
            DEFAULT_PORTS.VIDEOS_SERVICE.toString(),
          10,
        ),
      },
    },
  );
  await app.listen();
}
bootstrap();
