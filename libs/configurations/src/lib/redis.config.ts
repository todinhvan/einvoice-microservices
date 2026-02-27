import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

export class RedisConfiguration {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsString()
  @IsNotEmpty()
  PORT: string;

  @IsNumber()
  TTL: number;

  constructor() {
    this.HOST = process.env['REDIS_HOST'] || '';
    this.PORT = process.env['REDIS_PORT'] || '';
    this.TTL = Number(process.env['REDIS_TTL']) || 30 * 60 * 1000;
  }
}

export const RedisProvider = CacheModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const host = config.get<string>('REDIS_CONFIG.HOST');
    const port = config.get<string>('REDIS_CONFIG.PORT');
    const ttl = config.get<number>('REDIS_CONFIG.TTL');
    return {
      ttl,
      stores: [createKeyv(`redis://${host}:${port}`)],
    };
  },
});
