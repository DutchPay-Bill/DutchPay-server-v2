import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  getSecretKey(): string {
    return this.configService.get<string>('SECRET_KEY');
  }
}
