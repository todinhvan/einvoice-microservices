import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Configuation extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();
}

export const CONFIGURATION = new Configuation();
export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
