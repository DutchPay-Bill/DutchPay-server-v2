import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookieMiddleware } from './common/middlewares/cookies-parser.middleware';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
import { GoogleSessionMiddleware } from './common/middlewares/google-session.middleware';
import { CorsMiddleware } from './common/middlewares/cors-option.middleware';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './common/interceptors/authentication.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthenticationInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CorsMiddleware,
        CookieMiddleware,
        HelmetMiddleware,
        GoogleSessionMiddleware,
      )
      .forRoutes('*');
  }
}
