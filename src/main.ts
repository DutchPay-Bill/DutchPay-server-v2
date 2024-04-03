import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import { db } from './config/db/dbConnection';
// import { ValidationPipe } from '@nestjs/common';
// import middleWares from './middlewares';
// import corsMiddleware from './middlewares/corsOption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);

  // DB connection
  // db();

  // app.useGlobalPipes(new ValidationPipe());

  // Middleware setup
  // middleWares(app);

  // Custom CORS middleware setup
  // corsMiddleware(app);

  // Server port
  const serverPort = 3000;

  await app.listen(serverPort);
  console.log(`Nest application is running on: http://localhost:${serverPort}`);
}
bootstrap();
