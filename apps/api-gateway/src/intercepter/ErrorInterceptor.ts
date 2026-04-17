import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { RPC_STATUS_TO_HTTP_STATUS, HttpStatusVal } from '@libs';
import { Request } from 'express';

interface MicroserviceError {
  status?: string;
  message?: string;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url } = request;

        this.logger.error(`Error on ${method} ${url}:`, error);

        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        const microserviceError = error as MicroserviceError;
        if (microserviceError?.status && microserviceError?.message) {
          const httpStatus: number =
            RPC_STATUS_TO_HTTP_STATUS[
              microserviceError.status as HttpStatusVal
            ] || HttpStatus.INTERNAL_SERVER_ERROR;
          return throwError(
            () =>
              new HttpException(
                { statusCode: httpStatus, message: microserviceError.message },
                httpStatus,
              ),
          );
        }

        return throwError(
          () =>
            new HttpException(
              { message: 'Internal server error' },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
