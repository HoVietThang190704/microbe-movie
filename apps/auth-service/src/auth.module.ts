import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import {
  AUTH_REPOSITORY_TOKEN,
  AUTH_SERVICE_TOKEN,
} from './libs/shared/constant/auth';
import {
  USER_REPOSITORY_TOKEN,
  USER_SERVICE_TOKEN,
} from './libs/shared/constant/user';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './database/config/database.config';
import { jwtConfig } from './config/jwt.config';
import configuration from './config/configuration';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig, jwtConfig],
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
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    },
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useClass: AuthRepository,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService,
    },
  ],
})
export class AuthModule {}
