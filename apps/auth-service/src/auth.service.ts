import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import {
  LoginDto,
  RegisterDto,
  TokenRefreshResponse,
  JwtPayload,
  UserUpdateRequestDto,
  UserResponseDto,
} from '@libs';
import { JwtService } from '@nestjs/jwt';

import { USER_SERVICE_TOKEN, USER_MESSAGES } from '@libs/constants';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { firstValueFrom } from 'rxjs';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
}

interface FindByEmailRequest {
  email: string;
}

interface GetUserByIdRequest {
  id: string;
}

interface UpdateUserRequest {
  id: string;
  updateData: Partial<UserUpdateRequestDto>;
}

interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '1h';
  private readonly refreshTokenExpiresIn = '30d';
  private readonly refreshTokenExpiryDays = 30;
  private readonly bcryptRounds = 10;

  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginPayload: LoginDto): Promise<TokenRefreshResponse> {
    const { email, password } = loginPayload;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.email, user.username);
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(registerPayload: RegisterDto): Promise<UserResponseDto> {
    const { email, password, username } = registerPayload;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcryptjs.hash(password, this.bcryptRounds);
    const newUser = await this.send<CreateUserRequest, UserResponseDto>(
      USER_MESSAGES.CREATE,
      {
        email,
        password: passwordHash,
        username,
      },
    );

    if (!newUser) {
      throw new BadRequestException('Failed to create user');
    }

    return newUser;
  }

  async verifyToken(token: string): Promise<Pick<User, 'id' | 'email'> | null> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      return { id: decoded.sub, email: decoded.email };
    } catch {
      return null;
    }
  }

  async refreshToken(
    refreshTokenPayload: string,
  ): Promise<TokenRefreshResponse> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(refreshTokenPayload);

      const user = await this.send<GetUserByIdRequest, User>(
        USER_MESSAGES.GET_USER_BY_ID,
        { id: decoded.sub },
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user.id, user.email, user.username);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(
    userId: string,
    email: string,
    username: string,
  ): TokenRefreshResponse {
    const payload: JwtPayload = { sub: userId, email, username };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.send<FindByEmailRequest, User | null>(
      USER_MESSAGES.FIND_EMAIL,
      { email },
    );
  }

  private async updateUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenExpiry = this.calculateRefreshTokenExpiry();

    await this.send<UpdateUserRequest, void>(USER_MESSAGES.UPDATE_USER, {
      id: userId,
      updateData: {
        refreshToken,
        refreshTokenExpiry: refreshTokenExpiry.toISOString(),
      },
    });
  }

  private calculateRefreshTokenExpiry(): Date {
    return new Date(
      Date.now() + this.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
    );
  }

  private async send<TRequest, TResponse>(
    pattern: string,
    payload: TRequest,
  ): Promise<TResponse> {
    return await firstValueFrom(this.userClient.send(pattern, payload));
  }
}
