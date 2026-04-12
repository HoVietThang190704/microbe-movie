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
  @MessagePattern(AUTH_MESSAGES.REGISTER)
  register(payload: RegisterDto) {
    return this.authService.register(payload);
  }
  @MessagePattern(AUTH_MESSAGES.LOGIN)
  login(payload: LoginDto) {
    return {
      accessToken: `fake-jwt-token-for-${payload.email}`,
    };
  }
}
