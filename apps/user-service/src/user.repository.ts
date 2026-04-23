import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { UserEntity } from './database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
  async findEmail(email: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { email } });
  }
  async findId(id: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { id } });
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
  async getUserById(
    id: string,
  ): Promise<Omit<UserEntity, 'passwordHash'> | null> {
    return await this.repo.findOne({
      select: { passwordHash: false },
      where: {
        id,
      },
    });
  }
  async getUsersByIds(
    ids: string[],
  ): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    return await this.repo.find({
      select: { passwordHash: false },
      where: {
        id: In(ids),
      },
    });
  }
  async updateUser(
    id: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    await this.repo.update(id, updateData);
    return await this.repo.findOne({ where: { id } });
  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected! > 0;
  }
}
