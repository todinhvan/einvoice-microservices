/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.setGlobalPrefix(AppModule.CONFIGURATION.GLOBAL_PREFIX);
  await app.listen(AppModule.CONFIGURATION.APP_CONFIG.PORT);
  Logger.log(
    `🚀 Application is running on: http://localhost:${AppModule.CONFIGURATION.APP_CONFIG.PORT}/${AppModule.CONFIGURATION.GLOBAL_PREFIX}`
  );
}

bootstrap();
