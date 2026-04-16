import { IsEmail, IsJWT, IsOptional, IsString, IsUUID } from 'class-validator';

export class AuthResponseDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsJWT()
  accessToken: string;

  @IsOptional()
  @IsJWT()
  refreshToken?: string;
}
