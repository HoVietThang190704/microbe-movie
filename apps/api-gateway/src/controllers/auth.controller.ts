import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto, LoginDto } from '@libs';
import { AuthService } from '../services/auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerPayload: RegisterDto) {
    return await this.authService.register(registerPayload);
  }

  @Post('/login')
  async login(@Body() loginPayload: LoginDto) {
    return await this.authService.login(loginPayload);
  }
}
