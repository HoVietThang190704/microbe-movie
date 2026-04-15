import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VideosController } from './controllers/videos.controller';
import { VideosService } from './services/videos.service';
import {
  VIDEOS_SERVICE_TOKEN,
  AUTH_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,
  RABBITMQ_QUEUES,
  RABBITMQ_OPTIONS,
  RABBITMQ_URL_DEFAULT,
} from '@libs/constants';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { jwtConfig } from './config/jwt.config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
      }),
    }),
    ClientsModule.register([
      {
        name: VIDEOS_SERVICE_TOKEN,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT],
          queue: RABBITMQ_QUEUES.VIDEOS,
          queueOptions: RABBITMQ_OPTIONS,
        },
      },
      {
        name: AUTH_SERVICE_TOKEN,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT],
          queue: RABBITMQ_QUEUES.AUTH,
          queueOptions: RABBITMQ_OPTIONS,
        },
      },
      {
        name: USER_SERVICE_TOKEN,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT],
          queue: RABBITMQ_QUEUES.USER,
          queueOptions: RABBITMQ_OPTIONS,
        },
      },
    ]),
  ],
  controllers: [VideosController, AuthController],
  providers: [JwtStrategy, VideosService, AuthService],
})
export class AppModule {}
