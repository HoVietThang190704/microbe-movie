import { AUTH_MESSAGES, AUTH_SERVICE_TOKEN, RegisterDto, LoginDto } from '@libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly authClient: ClientProxy,
  ) {}

  private async send<TRequest, TResponse>(
    pattern: string,
    payload: TRequest,
  ): Promise<TResponse> {
    return await firstValueFrom(this.authClient.send(pattern, payload));
  }
  async register(registerPayload: RegisterDto): Promise<object> {
    return this.send<RegisterDto, object>(
      AUTH_MESSAGES.REGISTER,
      registerPayload,
    );
  }
  async login(loginPayload: LoginDto): Promise<{ accessToken: string }> {
    return this.send<LoginDto, { accessToken: string }>(
      AUTH_MESSAGES.LOGIN,
      loginPayload,
    );
  }
}
