import { IsNumber } from 'class-validator';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';

export class ThrottlerConfiguration {
  @IsNumber()
  TTL: number;

  @IsNumber()
  LIMIT: number;

  constructor() {
    this.TTL = Number(process.env['RATE_LIMIT_TTL']) || 60 * 1000;
    this.LIMIT = Number(process.env['RATE_LIMIT_REQUESTS']) || 5;
  }
}

export const ThrottlerProvider = ThrottlerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const ttl = config.get<number>('THROTTLER_CONFIG.TTL');
    const limit = config.get<number>('THROTTLER_CONFIG.LIMIT');
    const host = config.get<string>('REDIS_CONFIG.HOST');
    const port = config.get<number>('REDIS_CONFIG.PORT');
    return {
      throttlers: [
        {
          ttl,
          limit,
        },
      ],
      errorMessage: ErrorMessages.TOO_MANY_REQUESTS,
      storage: new ThrottlerStorageRedisService({
        host,
        port,
      }),
    } as ThrottlerModuleOptions;
  },
});
