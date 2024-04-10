import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const url = request.url;
    const isAuthRoute = url.startsWith('/v1/auth');

    if (isAuthRoute) {
      return next.handle();
    }

    const token = request.cookies.access_token;
    if (!token) {
      return response.status(401).json({ success: false, message: 'Unauthorized Access..' });
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      console.log('Decoded Token: ', decodedToken);
      request.user = decodedToken;
      return next.handle();
    } catch (error) {
      return response.status(500).json({ success: false, message: 'Invalid Request..!' });
    }
  }
}
