import { Inject, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { AUTH_REPOSITORY_TOKEN } from './libs/shared/constant/auth';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from '@libs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
  ) {}

  async register(registerPayload: RegisterDto): Promise<boolean> {
    const { email, password, username } = registerPayload;
    const existingUser = await this.authRepository.findEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = await this.authRepository.createUser(
      email,
      passwordHash,
      username,
    );
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return true;
  }
}
