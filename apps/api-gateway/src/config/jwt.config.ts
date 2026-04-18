import { registerAs } from '@nestjs/config';

console.log('JWT_SECRET:', process.env.JWT_SECRET);
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));
