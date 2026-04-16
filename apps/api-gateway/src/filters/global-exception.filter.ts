import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorLike {
  message?: string;
  stack?: string;
  error?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = this.toErrorLike(exception);

    this.logger.error(`Error: ${error.message ?? 'Unknown error'}`, {
      path: request.url,
      method: request.method,
      error: error.error,
      stack: error.stack,
    });

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseMessage = (exceptionResponse as { message?: unknown })
          .message;
        message =
          typeof responseMessage === 'string'
            ? responseMessage
            : Array.isArray(responseMessage)
              ? responseMessage.join(', ')
              : exception.message;
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      success: false,
      message,
      statusCode: status,
      timestamp: new Date(),
    });
  }

  private toErrorLike(exception: unknown): ErrorLike {
    if (exception instanceof Error) {
      return {
        message: exception.message,
        stack: exception.stack,
      };
    }

    if (typeof exception === 'object' && exception !== null) {
      return exception as ErrorLike;
    }

    return {
      message: String(exception),
    };
  }
}
