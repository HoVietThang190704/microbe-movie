import { Inject, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from '@libs';
import { JwtService } from '@nestjs/jwt';

import { USER_SERVICE_TOKEN, USER_MESSAGES } from '@libs/constants';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { first, firstValueFrom } from 'rxjs';
import { User } from './libs/shared/types/user';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginPayload: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
    const { email, password } = loginPayload;
    try {
      const user = await firstValueFrom<User>(
        this.userClient.send(USER_MESSAGES.FIND_EMAIL, { email }).pipe(first()),
      );
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await bcryptjs.compare(
        password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const accessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      }, { expiresIn: '1h' });

      const refreshToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      }, { expiresIn: '30d' });

      await firstValueFrom (
        this.userClient.send(USER_MESSAGES.UPDATE_USER, {
          id: user.id,
          updateData: {
            refreshToken,
            refreshTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        }).pipe(first())
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  }

  async verifyToken(token: string): Promise<Pick<User, 'id' | 'email'> | null> {
    try {
      const decoded = this.jwtService.verify<{
        userId: string;
        email: string;
      }>(token);
      return { id: decoded.userId, email: decoded.email };
    } catch (error) {
      return null;
    }
  }

  async refreshToken(refreshTokenPayload: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.jwtService.verify<{ userId: string; email: string }> (
        refreshTokenPayload
      );

      const user = await firstValueFrom<User>(
        this.userClient.send(USER_MESSAGES.GET_USER_BY_ID, { id: decoded.userId }).pipe(first()),
      );

      const newAccessToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      }, { expiresIn: '1h' });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
