import { DynamicModule, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { QueueServices } from '@shared/constants/enums/queue.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { hostname } from 'os';

@Module({})
export class KafkaModule {
  static forRoot(serviceName: QueueServices): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: serviceName,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: `${serviceName}-${hostname()}`,
                  brokers: [config.get<string>('KAFKA_CONFIG.URL') as string],
                },
              },
            }),
          },
        ]),
      ],
      providers: [
        {
          provide: KafkaService,
          useFactory: (client) => new KafkaService(client),
          inject: [serviceName],
        },
      ],
      exports: [KafkaService],
    };
  }
}
