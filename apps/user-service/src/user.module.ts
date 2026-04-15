import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { databaseConfig } from "./database/config/database.config";
import { DatabaseModule } from "./database/database.module";
import { UserController } from "./user.controller";
import { USER_REPOSITORY_TOKEN, USER_SERVICE_TOKEN } from "./libs/shared/constant/user";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    },
  ],
})
export class UserModule {}