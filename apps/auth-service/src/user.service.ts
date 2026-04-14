import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY_TOKEN } from "./libs/shared/constant/user";
import { UserEntity } from "./database/entities/user.entity";
import { UserRepository } from "./user.repository";


@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(
    email: string,
    passwordHash: string,
    username: string,
  ): Promise<UserEntity> {
    return await this.userRepository.createUser(email, passwordHash, username);
  }
}