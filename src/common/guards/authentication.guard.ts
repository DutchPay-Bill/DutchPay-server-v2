import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Authentication implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)

        .json({ success: false, message: 'Unauthorized Access..' });
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      console.log('Decoded Token: ', decodedToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res
        .status(500)

        .json({ success: false, message: 'Invalid Request..!' });
    }
  }
}
