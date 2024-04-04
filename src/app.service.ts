import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): any {
    return {
      success: true,
      message: 'Welcome to DutchPay API',
      version: '1.1.0',
    };
  }
}
