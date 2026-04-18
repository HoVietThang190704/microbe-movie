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
    this.logger.error('Caught exception in RPC:', {
      exceptionType: exception?.constructor?.name,
      message:
        exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
    });

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
      const errMsg = (exception as Error).message || 'Internal server error';
      return throwError(() => ({
        status: HTTP_STATUS_MAP.InternalServerErrorException,
        message: errMsg,
      }));
    }

    // Handle RpcException
    if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      this.logger.warn('RpcException error object:', rpcError);
      return throwError(() => rpcError);
    }

    // Handle unknown errors - ensure both status and message are present
    const errorMessage =
      exception instanceof Error ? exception.message : 'Unknown error';
    this.logger.error('Unhandled exception type:', errorMessage);
    return throwError(() => ({
      status: HTTP_STATUS_MAP.InternalServerErrorException,
      message: 'An unexpected error occurred',
      details: errorMessage,
    }));
  }
}
