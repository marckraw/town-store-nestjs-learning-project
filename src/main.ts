import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';

const port = 20152;

async function bootstrap() {
  const { PORT, LOG_LEVEL } = process.env;
  const app = await NestFactory.create(AppModule, {
    logger: [LOG_LEVEL as LogLevel],
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
