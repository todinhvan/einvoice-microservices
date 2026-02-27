import { BaseConfiguration } from '@shared/configurations/base.config';
import { AppConfiguration } from '@shared/configurations/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { RedisConfiguration } from '@shared/configurations/redis.config';
import { ThrottlerConfiguration } from '@shared/configurations/throttler.config';
import { GrpcConfiguration } from '@shared/configurations/grpc.config';
import { StripeConfiguration } from '@shared/configurations/stripe.config';
import { LokiConfiguration } from '@shared/configurations/loki.config';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_CONFIG: TcpConfiguration;

  @ValidateNested()
  @Type(() => RedisConfiguration)
  REDIS_CONFIG: RedisConfiguration;

  @ValidateNested()
  @Type(() => ThrottlerConfiguration)
  THROTTLER_CONFIG: ThrottlerConfiguration;

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_CONFIG: GrpcConfiguration;

  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG: StripeConfiguration;

  @ValidateNested()
  @Type(() => LokiConfiguration)
  LOKI_CONFIG: LokiConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['BFF_PORT']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.REDIS_CONFIG = new RedisConfiguration();
    this.THROTTLER_CONFIG = new ThrottlerConfiguration();
    this.GRPC_CONFIG = new GrpcConfiguration();
    this.STRIPE_CONFIG = new StripeConfiguration();
    this.LOKI_CONFIG = new LokiConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
