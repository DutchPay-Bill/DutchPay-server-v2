import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategyService } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        defaultStrategy: 'google',
        session: true,
        clientID: configService.get<string>('CLIENT_ID'),
        clientSecret: configService.get<string>('CLIENT_SECRET'),
        callbackURL: `${configService.get<string>('BE_URL')}/v1/auth/google/callback`,
        scope: ['email', 'profile'],
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategyService],
})
export class AuthModule {}
