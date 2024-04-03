import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';

@Injectable()
export class GoogleSessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isAuthRoute = req.path.includes('/auth');

    if (isAuthRoute) {
      return next();
    }

    session({
      secret: 'sessionSecret',
      resave: false,
      saveUninitialized: false,
    })(req, res, next);

    passport.initialize()(req, res, next);
    passport.session()(req, res, next);
  }
}
