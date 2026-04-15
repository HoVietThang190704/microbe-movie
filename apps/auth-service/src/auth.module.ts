import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  // AUTH_REPOSITORY_TOKEN,
  AUTH_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,  
  USER_ENV,             
} from '@libs/constants'; 
import { jwtConfig } from './config/jwt.config';
import configuration from './config/configuration';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEFAULT_PORTS } from '@libs/constants/ports';
import { DEFAULT_HOSTS } from '@libs/constants/hosts';

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
        transport: Transport.TCP,
        options: {
          host: process.env[USER_ENV.HOST] ?? DEFAULT_HOSTS.LOCALHOST,
          port: parseInt(
            process.env[USER_ENV.PORT] ?? DEFAULT_PORTS.USER_SERVICE.toString(),
            10,
          ),
        }
      }
    ])
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
