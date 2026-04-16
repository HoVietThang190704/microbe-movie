import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_MESSAGES,
  RegisterDto,
  LoginDto,
  TokenRefreshResponse,
  UserResponseDto,
} from '@libs';
import { AuthService } from './auth.service';
import { AUTH_SERVICE_TOKEN } from './libs/shared/constant/auth';

interface ValidateTokenRequest {
  token: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

@Controller()
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
  ) {}

  @MessagePattern(AUTH_MESSAGES.REGISTER)
  async register(@Payload() payload: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(payload);
  }

  @MessagePattern(AUTH_MESSAGES.LOGIN)
  async login(@Payload() payload: LoginDto): Promise<TokenRefreshResponse> {
    return this.authService.login(payload);
  }

  @MessagePattern(AUTH_MESSAGES.VALIDATE_TOKEN)
  async validateToken(
    @Payload() payload: ValidateTokenRequest,
  ): Promise<{ id: string; email: string } | null> {
    return this.authService.verifyToken(payload.token);
  }

  @MessagePattern(AUTH_MESSAGES.REFRESH_TOKEN)
  async refreshToken(
    @Payload() payload: RefreshTokenRequest,
  ): Promise<TokenRefreshResponse> {
    return this.authService.refreshToken(payload.refreshToken);
  }
}
