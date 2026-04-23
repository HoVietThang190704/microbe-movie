import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  USER_MESSAGES,
  CreateUserDto,
  UpdateUserDto,
  UserUpdateRequestDto,
  UserResponseDto,
} from '@libs';
import { UserService } from './user.service';
import { USER_SERVICE_TOKEN } from './libs/shared/constant/user';

interface GetUserByIdPayload {
  id: string;
}

interface GetUsersByIdsPayload {
  ids: string[];
}

interface FindEmailPayload {
  email: string;
}

interface UpdateUserPayload {
  id: string;
  updateData: Partial<
    UpdateUserDto &
      Pick<UserUpdateRequestDto, 'refreshToken' | 'refreshTokenExpiry'>
  >;
}

interface DeleteUserPayload {
  id: string;
}

@Controller()
export class UserController {
  constructor(
    @Inject(USER_SERVICE_TOKEN) private readonly userService: UserService,
  ) {}

  @MessagePattern(USER_MESSAGES.CREATE)
  async create(@Payload() payload: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(payload);
  }

  @MessagePattern(USER_MESSAGES.FIND_EMAIL)
  async findEmail(
    @Payload() payload: FindEmailPayload,
  ): Promise<UserResponseDto | null> {
    return this.userService.findEmail(payload.email);
  }

  @MessagePattern(USER_MESSAGES.GET_USER_BY_ID)
  async getUserById(
    @Payload() payload: GetUserByIdPayload,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(payload.id);
  }

  @MessagePattern(USER_MESSAGES.GET_USERS_BY_IDS)
  async getUsersByIds(
    @Payload() payload: GetUsersByIdsPayload,
  ): Promise<UserResponseDto[]> {
    return this.userService.getUsersByIds(payload.ids);
  }

  @MessagePattern(USER_MESSAGES.UPDATE_USER)
  async updateUser(
    @Payload() payload: UpdateUserPayload,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(payload.id, payload.updateData);
  }

  @MessagePattern(USER_MESSAGES.DELETE_USER)
  async deleteUser(@Payload() payload: DeleteUserPayload): Promise<boolean> {
    return this.userService.deleteUser(payload.id);
  }
}
