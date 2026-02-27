import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { initTracing } from '@shared/observability/tracing';
import { ServiceName } from '@shared/constants/enums/common.enum';

initTracing(ServiceName.BFF);

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      bufferLogs: true,
    });
    const globalPrefix = AppModule.Configuration.GLOBAL_PREFIX;
    const port = AppModule.Configuration.APP_CONFIG.PORT;

    app.useLogger(app.get(PinoLogger));
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
      origin: '*',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('E-Invoice API')
      .setDescription('API List of E-Invoice backend for microservices')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        name: 'Authorization',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        in: 'header',
        description: 'Authorization with Bearer Token',
      })
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument);

    await app.listen(port);
    Logger.log(`BFF Service is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`Swagger for BFF Service is running on: http://localhost:${port}/${globalPrefix}/docs`);
  } catch (error) {
    Logger.error('BFF Service run failed', error);
  }
}

bootstrap();
