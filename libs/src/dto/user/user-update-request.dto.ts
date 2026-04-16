import {
  IsDateString,
  IsEmail,
  IsJWT,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserUpdateRequestDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(50, { message: 'Username must be at most 50 characters long' })
  username?: string;

  @IsOptional()
  @IsJWT({ message: 'Invalid refresh token' })
  refreshToken?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Refresh token expiry must be a valid date string' },
  )
  refreshTokenExpiry?: string;
}
