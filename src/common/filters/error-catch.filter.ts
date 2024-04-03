// eslint-disable-next-line prettier/prettier
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpErrorHandler } from './error-handler';

@Catch(HttpErrorHandler)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpErrorHandler, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'An error occurred';

    response.status(status).json({ success: false, message });
  }
}
