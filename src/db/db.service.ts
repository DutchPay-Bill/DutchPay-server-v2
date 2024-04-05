import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class PrismaService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['info'],
    });
  }

  get client() {
    return this.prisma;
  }

  async connectDB(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnectDB(): Promise<void> {
    await this.prisma.$disconnect();
  }

  async db(): Promise<void> {
    try {
      await this.connectDB();
      console.log('connected to database');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await this.disconnectDB();
    }
  }
}
