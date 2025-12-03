import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUE_SERVICES } from '@common/constants/enums/queue-groups.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { hostname } from 'os';

@Module({})
export class KafkaModule {
  static register(serviceName: QUEUE_SERVICES): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: serviceName,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: `${serviceName}-${hostname()}`,
                    brokers: [configService.get<string>('KAFKA_CONFIG.URL') || 'localhost:9092'],
                  },
                },
              };
            },
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
