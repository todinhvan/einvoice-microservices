/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;
    const port = AppModule.CONFIGURATION.APP_CONFIG.PORT;
    app.setGlobalPrefix(globalPrefix);

    const config = new DocumentBuilder()
      .setTitle('EInvoice-Bff API')
      .setDescription('The EInvoice-Bff API description')
      .setVersion('1.0.0')
      .addBearerAuth({
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory, {
      swaggerOptions: {
        filter: true,
      },
    });

    await app.listen(port);
    Logger.log(`🚀 EInvoice-Bff API is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`🚀 EInvoice-Bff API Swagger is running on: http://localhost:${port}/${globalPrefix}/docs`);
  } catch (error) {
    Logger.error(`❌ Application failed to start: ${error}`, '', 'Bootstrap', false);
  }
}

bootstrap();
