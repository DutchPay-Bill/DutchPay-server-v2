import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ErrorCatch } from './common/filters/error-catch.filter';
import { PrismaService } from './db/db.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  // http validation
  app.useGlobalPipes(new ValidationPipe());
  // custom error catch
  app.useGlobalFilters(new ErrorCatch());

  // Server port
  const serverPort = configService.get<string>('SERVER_PORT') || 3001;
  await app.listen(serverPort);
  console.log(`Nest application is running on: http://localhost:${serverPort}`);
  // check DB connection
  prismaService.db();
}
bootstrap();
