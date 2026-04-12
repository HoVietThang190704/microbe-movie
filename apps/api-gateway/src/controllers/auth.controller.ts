import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RegisterDto, LoginDto } from '@libs';
import { AuthService } from '../services/auth.service';
import { ResponseInterceptor } from '../intercepter/ResponseIntercepter';

@Controller('/api/auth')
@UseInterceptors(ResponseInterceptor)
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
