import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_MESSAGES, RegisterDto, LoginDto } from '@libs';

@Controller()
export class AuthController {
  @MessagePattern(AUTH_MESSAGES.REGISTER)
  register(payload: RegisterDto) {
    return {
      message: `User ${payload.username} registered successfully`,
    };
  }
  @MessagePattern(AUTH_MESSAGES.LOGIN)
  login(payload: LoginDto) {
    return {
      accessToken: `fake-jwt-token-for-${payload.email}`,
    };
  }
}
