import { DynamicModule, Module } from '@nestjs/common';
import { ServiceName } from '@shared/constants/enums/common.enum';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransportTargetOptions } from 'pino';

@Module({})
export class LoggerModule {
  static forRoot(serviceName: ServiceName): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const targets: TransportTargetOptions[] = [];

            // 1. Pretty Print for non-production (Dev)
            if (config.get<string>('NODE_ENV') !== 'production') {
              targets.push({
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              });
            }

            // 2. Loki Push (Enable via env var)
            if (config.get<boolean>('LOKI_CONFIG.ENABLE_PUSH')) {
              targets.push({
                target: 'pino-loki',
                options: {
                  host: config.get<string>('LOKI_CONFIG.URL'),
                  batching: true,
                  interval: 5,
                  labels: {
                    service: serviceName,
                  },
                },
              });
            }

            return {
              pinoHttp: {
                transport: targets.length > 0 ? { targets } : undefined,
                autoLogging: false,
                serializers: {
                  req: () => undefined,
                  res: () => undefined,
                },
              },
            };
          },
        }),
      ],
      exports: [PinoLoggerModule],
    };
  }
}
