import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VideosController } from './controllers/videos.controller';
import { VideosService } from './services/videos.service';
import {
  VIDEOS_SERVICE_TOKEN,
  VIDEOS_ENV,
  DEFAULT_PORTS,
  DEFAULT_HOSTS,
} from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: VIDEOS_SERVICE_TOKEN,
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
    ]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class AppModule {}
