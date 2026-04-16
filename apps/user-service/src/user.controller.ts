import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USER_MESSAGES, RegisterDto } from '@libs';
import { UserService } from './user.service';
import { USER_SERVICE_TOKEN } from './libs/shared/constant/user';

@Controller()
export class UserController {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userService: UserService,
  ) {}
  @MessagePattern(USER_MESSAGES.REGISTER)
  register(payload: RegisterDto) {
    return this.userService.register(payload);
  }
  @MessagePattern(USER_MESSAGES.GET_USER_BY_ID)
  getUserById(payload: { id: string }) {
    return this.userService.getUserById(payload.id);
  }
  @MessagePattern(USER_MESSAGES.FIND_EMAIL)
  findEmail(payload: { email: string }) {
    return this.userService.findEmail(payload.email);
  }
  @MessagePattern(USER_MESSAGES.UPDATE_USER)
  updateUser(payload: {
    id: string;
    updateData: Partial<{ email: string; username: string; refreshToken: string; refreshTokenExpiry: Date }>;
  }) {
    return this.userService.updateUser(payload.id, payload.updateData);
  }
  @MessagePattern(USER_MESSAGES.DELETE_USER)
  deleteUser(payload: { id: string }) {
    return this.userService.deleteUser(payload.id);
  }
}
