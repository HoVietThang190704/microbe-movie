import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY_TOKEN } from './libs/shared/constant/user';
import { RegisterDto } from '@libs';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async register(
    registerPayload: RegisterDto,
  ): Promise<{ id: string; email: string; username: string }> {
    const { email, password, username } = registerPayload;
    const existingUser = await this.userRepository.findEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    const passwordHash = await bcryptjs.hash(password, 10);
    const newUser = await this.userRepository.createUser(
      email,
      passwordHash,
      username,
    );
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return { id: newUser.id, email: newUser.email, username: newUser.username };
  }
  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findEmail(email: string) {
    return this.userRepository.findEmail(email);
  }
  async updateUser(
    id: string,
    updateData: Partial<{ email: string; username: string }>,
  ) {
    const updated = await this.userRepository.updateUser(id, updateData);
    return updated;
  }
  async deleteUser(id: string) {
    return await this.userRepository.deleteUser(id);
  }
}
