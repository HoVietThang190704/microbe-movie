import { Inject, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from '@libs';
import { JwtService } from '@nestjs/jwt';

import { USER_SERVICE_TOKEN, USER_MESSAGES } from '@libs/constants';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { first, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginPayload: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginPayload;
    try {
      const user = await firstValueFrom(
        this.userClient.send(USER_MESSAGES.FIND_EMAIL, { email }).pipe(first())
      );
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const accessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  }
  async verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return { userId: decoded.userId, email: decoded.email };
    } catch (error) {
      return null;
    }
  }
}
