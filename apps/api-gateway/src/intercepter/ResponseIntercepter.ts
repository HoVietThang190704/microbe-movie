import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { BaseResponse } from '@libs/types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  BaseResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        success: true,
        message: 'Request successful',
        timestamp: new Date(),
      })),
    );
  }
}
