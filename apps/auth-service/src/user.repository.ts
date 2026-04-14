import { Injectable } from "@nestjs/common";
import { UserEntity } from "./database/entities/user.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  async createUser(
    email: string,
    passwordHash: string,
    username: string,
  ): Promise<UserEntity> {
    return await this.repo.save(
      this.repo.create({ email, passwordHash, username }),
    );
  }
}