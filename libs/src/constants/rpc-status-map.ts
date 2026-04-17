import { HttpStatus } from '@nestjs/common';
import { HTTP_STATUS_MAP, HttpStatusVal } from './http_error';

export const RPC_STATUS_TO_HTTP_STATUS: Record<HttpStatusVal, number> = {
  [HTTP_STATUS_MAP.NotFoundException]: HttpStatus.NOT_FOUND,
  [HTTP_STATUS_MAP.UnauthorizedException]: HttpStatus.UNAUTHORIZED,
  [HTTP_STATUS_MAP.ForbiddenException]: HttpStatus.FORBIDDEN,
  [HTTP_STATUS_MAP.BadRequestException]: HttpStatus.BAD_REQUEST,
  [HTTP_STATUS_MAP.InternalServerErrorException]:
    HttpStatus.INTERNAL_SERVER_ERROR,
} as const;
