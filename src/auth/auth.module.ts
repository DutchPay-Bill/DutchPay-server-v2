import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategyService } from './strategy/google.strategy';

@Module({
  imports: [
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        defaultStrategy: 'google',
        session: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GoogleStrategyService],
})
export class AuthModule {}
