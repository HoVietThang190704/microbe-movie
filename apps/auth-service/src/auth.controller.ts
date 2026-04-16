import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_MESSAGES, RegisterDto, LoginDto } from '@libs';
import { AuthService } from './auth.service';
import { AUTH_SERVICE_TOKEN } from './libs/shared/constant/auth';

@Controller()
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
  ) {}
  @MessagePattern(AUTH_MESSAGES.LOGIN)
  login(payload: LoginDto) {
    return this.authService.login(payload);
  }
  @MessagePattern(AUTH_MESSAGES.VALIDATE_TOKEN)
  validateToken(payload: { token: string }) {
    return this.authService.verifyToken(payload.token);
  }
  @MessagePattern(AUTH_MESSAGES.REFRESH_TOKEN)
  refreshToken(payload: { refreshToken: string }) {
    return this.authService.refreshToken(payload.refreshToken);
  }
}
