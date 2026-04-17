import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RPC_STATUS_TO_HTTP_STATUS, HttpStatusVal } from '../constants';

interface MicroserviceError {
  status?: HttpStatusVal;
  message?: string;
  details?: unknown;
}

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

        throw new HttpException(
          { message: 'Service error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    ),
  );
}
