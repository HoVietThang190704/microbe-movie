import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;
}
