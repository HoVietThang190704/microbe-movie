export const HTTP_STATUS_MAP = {
  NotFoundException: 'NOT_FOUND',
  UnauthorizedException: 'UNAUTHORIZED',
  ForbiddenException: 'FORBIDDEN',
  BadRequestException: 'BAD_REQUEST',
  InternalServerErrorException: 'INTERNAL_ERROR',
} as const;
export type HttpStatusVal =
  (typeof HTTP_STATUS_MAP)[keyof typeof HTTP_STATUS_MAP];
