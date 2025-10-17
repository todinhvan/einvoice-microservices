import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { TypeORMConfiguration } from '@common/configuration/type-orm.config';

class Configuation extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => TypeORMConfiguration)
  TYPEORM_CONFIG = new TypeORMConfiguration();
}

export const CONFIGURATION = new Configuation();
export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
