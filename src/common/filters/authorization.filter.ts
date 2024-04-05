// not use yet this for future update
import { HttpStatus, HttpException } from '@nestjs/common';

export class UnauthorizedRoleException extends HttpException {
  constructor(role: string) {
    super(`Access forbidden for role: ${role}`, HttpStatus.FORBIDDEN);
  }
}
