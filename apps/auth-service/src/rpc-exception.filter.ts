import { Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import {
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { HTTP_STATUS_MAP } from '@libs';

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: unknown): Observable<any> {
    this.logger.error('Caught exception:', exception);

    if (exception instanceof NotFoundException) {
      return throwError(() => ({
        status: HTTP_STATUS_MAP.NotFoundException,
        message: (exception as Error).message || 'Resource not found',
      }));
    }

    if (exception instanceof UnauthorizedException) {
      return throwError(() => ({
        status: HTTP_STATUS_MAP.UnauthorizedException,
        message: (exception as Error).message || 'Unauthorized access',
      }));
    }

    if (exception instanceof ForbiddenException) {
      return throwError(() => ({
        status: HTTP_STATUS_MAP.ForbiddenException,
        message: (exception as Error).message || 'Access forbidden',
      }));
    }

    if (exception instanceof BadRequestException) {
      return throwError(() => ({
        status: HTTP_STATUS_MAP.BadRequestException,
        message: (exception as Error).message || 'Invalid request',
      }));
    }

    if (exception instanceof InternalServerErrorException) {
      return throwError(() => ({
        status: HTTP_STATUS_MAP.InternalServerErrorException,
        message: (exception as Error).message || 'Internal server error',
      }));
    }

    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    return throwError(() => ({
      status: HTTP_STATUS_MAP.InternalServerErrorException,
      message: 'An unexpected error occurred',
      details: exception instanceof Error ? exception.message : 'Unknown error',
    }));
  }
}
