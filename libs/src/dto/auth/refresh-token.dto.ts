import { IsJWT, IsString } from 'class-validator';

export class RefreshDto {
  @IsJWT({ message: 'Invalid refresh token' })
  @IsString()
  refreshToken: string;
}
