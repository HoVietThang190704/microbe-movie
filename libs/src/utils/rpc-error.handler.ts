import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RPC_STATUS_TO_HTTP_STATUS, HttpStatusVal } from '../constants';

interface MicroserviceError {
  status?: HttpStatusVal;
  message?: string;
  details?: unknown;
}

const logger = new Logger('handleMicroserviceCall');

export async function handleMicroserviceCall<TRequest, TResponse>(
  client: ClientProxy,
  pattern: string,
  payload: TRequest,
): Promise<TResponse> {
  return await firstValueFrom(
    client.send<TResponse>(pattern, payload).pipe(
      catchError((error: unknown): Observable<never> => {
        const microserviceError = error as MicroserviceError;

        if (microserviceError?.status && microserviceError?.message) {
          const httpStatus: number =
            RPC_STATUS_TO_HTTP_STATUS[microserviceError.status] ||
            HttpStatus.INTERNAL_SERVER_ERROR;
          throw new HttpException(
            { statusCode: httpStatus, message: microserviceError.message },
            httpStatus,
          );
        }

        // Enhanced logging for debugging
        logger.error(
          `Microservice error for pattern "${pattern}": missing status or message`,
          {
            receivedError: microserviceError,
            errorType: typeof error,
            errorKeys: error && typeof error === 'object' ? Object.keys(error as object) : 'N/A',
            rawError: error instanceof Error ? error.message : String(error),
          },
        );

        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Service error',
            details: error instanceof Error ? error.message : String(error),
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    ),
  );
}
