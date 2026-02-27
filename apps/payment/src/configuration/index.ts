import { BaseConfiguration } from '@shared/configurations/base.config';
import { AppConfiguration } from '@shared/configurations/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { StripeConfiguration } from '@shared/configurations/stripe.config';

export class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_CONFIG: TcpConfiguration;

  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG: StripeConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['PAYMENT_PORT']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.STRIPE_CONFIG = new StripeConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
