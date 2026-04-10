import 'tsconfig-paths/register';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { NestFactory } from '@nestjs/core';
import { AUTH_ENV, DEFAULT_HOSTS, DEFAULT_PORTS } from '@libs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env[AUTH_ENV.HOST] ?? DEFAULT_HOSTS.LOCALHOST,
        port: parseInt(
          process.env[AUTH_ENV.PORT] ?? DEFAULT_PORTS.AUTH_SERVICE.toString(),
          10,
        ),
      },
    },
  );
  await app.listen();
}
bootstrap();
