/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QueueGroups } from '@shared/constants/enums/queue.enum';
import { initTracing } from '@shared/observability/tracing';
import { ServiceName } from '@shared/constants/enums/common.enum';

initTracing(ServiceName.MAIL);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = AppModule.Configuration.GLOBAL_PREFIX;
  const port = AppModule.Configuration.APP_CONFIG.PORT;

  app.setGlobalPrefix(globalPrefix);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [AppModule.Configuration.KAFKA_CONFIG.URL],
      },
      consumer: {
        groupId: QueueGroups.MAIL,
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`Mail Service is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
