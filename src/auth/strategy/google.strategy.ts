import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategyService {
  constructor(private readonly configService: ConfigService) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
          clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
          callbackURL: this.configService.get<string>('GOOGLE_CALLBACK_URL'),
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log('Google Authentication Profile:', profile);
          const user = await getEmail(profile.emails?.[0].value as string);
          try {
            if (!user) {
              const newUser = await registerUserbyGoogleService(
                profile.displayName,
                profile.emails?.[0].value as string,
              );
              if (newUser && newUser.data) {
                done(null, newUser.data);
              } else {
                done(new Error('Failed to register user'));
              }
            } else {
              done(null, user);
            }
          } catch (error: any) {
            console.error(error);
            done(error);
          }
        },
      ),
    );
  }
}
