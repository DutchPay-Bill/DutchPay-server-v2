import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategyService extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(private readonly googleRegis: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BE_URL}/v1/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Google Authentication Profile:', profile);
    const user = await this.googleRegis.getEmail(
      profile.emails?.[0].value as string,
    );
    try {
      if (!user) {
        const newUser = await this.googleRegis.registerUserbyGoogleService(
          profile.displayName,
          profile.emails?.[0].value as string,
        );
        if (newUser) {
          done(null, newUser);
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
  }
}
