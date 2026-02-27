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

initTracing(ServiceName.USER_ACCESS);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = AppModule.Configuration.GLOBAL_PREFIX;
  const port = AppModule.Configuration.APP_CONFIG.PORT;

  app.setGlobalPrefix(globalPrefix);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: AppModule.Configuration.TCP_CONFIG.TCP_USER_ACCESS.options.host,
      port: AppModule.Configuration.TCP_CONFIG.TCP_USER_ACCESS.options.port,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AppModule.Configuration.GRPC_CONFIG.GRPC_USER_ACCESS.options.package,
      protoPath: AppModule.Configuration.GRPC_CONFIG.GRPC_USER_ACCESS.options.protoPath,
      url: AppModule.Configuration.GRPC_CONFIG.GRPC_USER_ACCESS.options.url,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`User Access Service is running on: http://localhost:${port}/${globalPrefix}/user-access`);
}

bootstrap();
