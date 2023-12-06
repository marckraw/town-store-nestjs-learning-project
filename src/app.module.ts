import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { AllErrorsFilter } from './errors/all-errors.filter';
import { CookieCheckMiddleware } from './middlewares/cookie-check.middleware';
import { LanguageExtractorMiddleware } from './middlewares/language-extractor.middleware';
import { ProductModule } from './products/product.module';
import { ExpenseModule } from './expense/expense.module';
import { OrdersModule } from './orders/orders.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { validationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    LoggerModule.forRootAsync({
      useFactory: async () => ({
        pinoHttp: {
          level: process.env.LOG_LEVEL,
          useLevel: 'debug',
          transport: {
            target: path.resolve(__dirname, 'pino-pretty-config.js'),
          },
          quietReqLogger: true,
        },
      }),
    }),
    ProductModule,
    ExpenseModule,
    OrdersModule,
    SharedModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllErrorsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LanguageExtractorMiddleware, CookieCheckMiddleware)
      .forRoutes('*');
  }
}
