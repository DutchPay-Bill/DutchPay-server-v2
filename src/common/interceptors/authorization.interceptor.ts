// not use yet this for future update
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UnauthorizedRoleException } from '../filters/authorization.filter';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;

    if (!this.allowedRoles.includes(userRole)) {
      throw new UnauthorizedRoleException(userRole);
    }

    return true;
  }
}
