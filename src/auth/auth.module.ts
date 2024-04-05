import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategyService } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/db/prisma.module';
import { JwtSecret, JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.registerAsync({
      useFactory: async () => ({
        defaultStrategy: 'google',
        session: true,
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategyService],
})
export class AuthModule {}
