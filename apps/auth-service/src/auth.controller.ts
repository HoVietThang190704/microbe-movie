import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_MESSAGES, RegisterDto } from '@libs';

@Controller()
export class AuthController {
  @MessagePattern(AUTH_MESSAGES.REGISTER)
  register(payload: RegisterDto) {
    return {
      message: `User ${payload.username} registered successfully`,
    };
  }
}
