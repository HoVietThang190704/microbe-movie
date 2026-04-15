import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AUTH_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,
  RABBITMQ_QUEUES,
  RABBITMQ_OPTIONS,
  RABBITMQ_URL_DEFAULT,
} from '@libs/constants';
import { jwtConfig } from './config/jwt.config';
import configuration from './config/configuration';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, jwtConfig],
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
    ClientsModule.register([
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
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
