import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
})
export class UsersModule {
  constructor(private readonly configService: ConfigService) {}

  getJwtSecretKey(): string | null {
    return this.configService.get<string>('jwt.secretKey');
  }
}
