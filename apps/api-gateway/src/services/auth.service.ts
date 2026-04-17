import {
  AUTH_MESSAGES,
  AUTH_SERVICE_TOKEN,
  USER_SERVICE_TOKEN,
  RegisterDto,
  LoginDto,
  handleMicroserviceCall,
} from '@libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authClient: ClientProxy,
    @Inject(USER_SERVICE_TOKEN) private readonly userClient: ClientProxy,
  ) {}

  async register(registerPayload: RegisterDto): Promise<object> {
    return handleMicroserviceCall<RegisterDto, object>(
      this.authClient,
      AUTH_MESSAGES.REGISTER,
      registerPayload,
    );
  }

  async login(loginPayload: LoginDto): Promise<{ accessToken: string }> {
    return handleMicroserviceCall<LoginDto, { accessToken: string }>(
      this.authClient,
      AUTH_MESSAGES.LOGIN,
      loginPayload,
    );
  }
}
