import { BaseConfiguration } from '@shared/configurations/base.config';
import { AppConfiguration } from '@shared/configurations/app.config';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeOrmConfiguration } from '@shared/configurations/type-orm.config';
import { DatabaseType } from 'typeorm';

export class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_CONFIG: TcpConfiguration;

  @ValidateNested()
  @Type(() => TypeOrmConfiguration)
  TYPEORM_CONFIG: TypeOrmConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['PRODUCT_PORT']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.TYPEORM_CONFIG = new TypeOrmConfiguration({
      TYPE: process.env['PRODUCT_DB_TYPE'] as DatabaseType,
      HOST: process.env['PRODUCT_DB_HOST'],
      PORT: Number(process.env['PRODUCT_DB_PORT']),
      USERNAME: process.env['PRODUCT_DB_USERNAME'],
      PASSWORD: process.env['PRODUCT_DB_PASSWORD'],
      DATABASE_NAME: process.env['PRODUCT_DB_NAME'],
    });
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
