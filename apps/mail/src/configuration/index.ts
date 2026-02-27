import { BaseConfiguration } from '@shared/configurations/base.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AppConfiguration } from '@shared/configurations/app.config';
import { KafkaConfiguration } from '@shared/configurations/kafka.config';
import { MailConfiguration } from '@shared/configurations/mail.config';

export class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => KafkaConfiguration)
  KAFKA_CONFIG: KafkaConfiguration;

  @ValidateNested()
  @Type(() => MailConfiguration)
  MAIL_CONFIG: MailConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['MAIL_PORT']),
    });
    this.KAFKA_CONFIG = new KafkaConfiguration();
    this.MAIL_CONFIG = new MailConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
