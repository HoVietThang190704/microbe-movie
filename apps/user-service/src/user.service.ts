import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserUpdateRequestDto,
} from '@libs';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY_TOKEN } from './libs/shared/constant/user';
import { UserEntity } from './database/entities/user.entity';

@Injectable()
export class UserService {
  private readonly BCRYPT_ROUNDS = 10;

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserPayload: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, username } = createUserPayload;

    try {
      const passwordHash = await bcryptjs.hash(password, this.BCRYPT_ROUNDS);
      const newUser = await this.userRepository.createUser(
        email,
        passwordHash,
        username,
      );

      if (!newUser) {
        throw new InternalServerErrorException('Failed to create user');
      }

      return this.mapToUserResponseDto(newUser);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToUserResponseDto(user);
  }

  async findEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findEmail(email);
  }

  async updateUser(
    id: string,
    updateData: UpdateUserDto | UserUpdateRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const updated = await this.userRepository.updateUser(id, updateData);

      if (!updated) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.mapToUserResponseDto(updated);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the user',
      );
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const deleted = await this.userRepository.deleteUser(id);

      if (!deleted) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return true;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while deleting the user',
      );
    }
  }

  private mapToUserResponseDto(user: Partial<UserEntity>): UserResponseDto {
    return {
      id: user.id!,
      email: user.email!,
      username: user.username!,
    };
  }
}
