import { IsDateString, IsJWT, IsOptional } from 'class-validator';
import { RegisterDto } from '../auth';

export class CreateUserDto extends RegisterDto {
  @IsOptional()
  @IsJWT({ message: 'Invalid refresh token format' })
  refreshToken?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Refresh token expiry must be a valid ISO date string' },
  )
  refreshTokenExpiry?: string;
}
