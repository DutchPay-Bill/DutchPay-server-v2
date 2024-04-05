import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as passport from 'passport';

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
    })(req, res, (err) => {
      if (err) {
        return next(err);
      }

      passport.initialize()(req, res, (err) => {
        if (err) {
          return next(err);
        }

        passport.session()(req, res, next);
      });
    });
  }
}
