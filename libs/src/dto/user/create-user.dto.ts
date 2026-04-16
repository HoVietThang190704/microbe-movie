import { RegisterDto } from "../auth";

export class CreateUserDto extends RegisterDto {
  refreshToken?: string;
}