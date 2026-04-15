import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VideosController } from './controllers/videos.controller';
import { VideosService } from './services/videos.service';
import {
  VIDEOS_SERVICE_TOKEN,
  VIDEOS_ENV,
  DEFAULT_PORTS,
  DEFAULT_HOSTS,
  AUTH_SERVICE_TOKEN,
  AUTH_ENV,
  USER_SERVICE_TOKEN,
  USER_ENV,
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
      {
        name: AUTH_SERVICE_TOKEN,
        transport: Transport.TCP,
        options: {
          host: process.env[AUTH_ENV.HOST] ?? DEFAULT_HOSTS.LOCALHOST,
          port: parseInt(
            process.env[AUTH_ENV.PORT] ?? DEFAULT_PORTS.AUTH_SERVICE.toString(),
            10,
          ),
        },
      },
      {
        name: USER_SERVICE_TOKEN,
        transport: Transport.TCP,
        options: {
          host: process.env[USER_ENV.HOST] ?? DEFAULT_HOSTS.LOCALHOST,
          port: parseInt(
            process.env[USER_ENV.PORT] ?? DEFAULT_PORTS.USER_SERVICE.toString(),
            10,
          ),
        },
      },
    ]),
  ],
  controllers: [VideosController, AuthController],
  providers: [JwtStrategy, VideosService, AuthService],
})
export class AppModule {}
