import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { CookieMiddleware } from './common/middlewares/cookies-parser.middleware';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
// import { GoogleSessionMiddleware } from './common/middlewares/google-session.middleware';
// import { CorsMiddleware } from './common/middlewares/cors-option.middleware';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // CookieMiddleware,
        HelmetMiddleware,
        // GoogleSessionMiddleware,
        // CorsMiddleware,
      )
      .forRoutes('*');
  }
}
