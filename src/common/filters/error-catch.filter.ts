import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorHandler } from './error-handler';

@Catch(ErrorHandler)
export class ErrorCatch implements ExceptionFilter {
  catch(exception: ErrorHandler, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.status || HttpStatus.BAD_REQUEST;
    const message = Array.isArray(exception.message) ? exception.message : [exception.message];

    response.status(status).json({
      message: message,
      error: HttpStatus[status],
      statusCode: status,
    });
  }
}
