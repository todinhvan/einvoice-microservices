/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { initTracing } from '@shared/observability/tracing';
import { ServiceName } from '@shared/constants/enums/common.enum';

initTracing(ServiceName.AUTHORIZER);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = AppModule.Configuration.GLOBAL_PREFIX;
  const port = AppModule.Configuration.APP_CONFIG.PORT;

  app.setGlobalPrefix(globalPrefix);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: AppModule.Configuration.TCP_CONFIG.TCP_AUTHORIZER.options.host,
      port: AppModule.Configuration.TCP_CONFIG.TCP_AUTHORIZER.options.port,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AppModule.Configuration.GRPC_CONFIG.GRPC_AUTHORIZER.options.package,
      protoPath: AppModule.Configuration.GRPC_CONFIG.GRPC_AUTHORIZER.options.protoPath,
      url: AppModule.Configuration.GRPC_CONFIG.GRPC_AUTHORIZER.options.url,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`Authorizer Service is running on: http://localhost:${port}/${globalPrefix}/authorizer`);
}

bootstrap();
