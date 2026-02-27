import { BaseConfiguration } from '@shared/configurations/base.config';
import { AppConfiguration } from '@shared/configurations/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { MongoConfiguration } from '@shared/configurations/mongo.config';
import { KafkaConfiguration } from '@shared/configurations/kafka.config';
import { LokiConfiguration } from '@shared/configurations/loki.config';

export class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_CONFIG: TcpConfiguration;

  @ValidateNested()
  @Type(() => MongoConfiguration)
  MONGO_CONFIG: MongoConfiguration;

  @ValidateNested()
  @Type(() => KafkaConfiguration)
  KAFKA_CONFIG: KafkaConfiguration;

  @ValidateNested()
  @Type(() => LokiConfiguration)
  LOKI_CONFIG: LokiConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['INVOICE_PORT']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.MONGO_CONFIG = new MongoConfiguration({
      URI: process.env['INVOICE_DB_URI'],
      DATABASE_NAME: process.env['INVOICE_DB_NAME'],
    });
    this.KAFKA_CONFIG = new KafkaConfiguration();
    this.LOKI_CONFIG = new LokiConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
