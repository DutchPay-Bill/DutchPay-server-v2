import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorHandler } from './error-handler';

@Catch(ErrorHandler)
export class ErrorCatch implements ExceptionFilter {
  catch(exception: ErrorHandler, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'An error occurred';

    response.status(status).json({ success: false, message });
  }
}
