import { AppConfiguration } from '@shared/configurations/app.config';
import { BaseConfiguration } from '@shared/configurations/base.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { CloudinaryConfiguration } from '@shared/configurations/cloudinary.config';

export class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_CONFIG: TcpConfiguration;

  @ValidateNested()
  @Type(() => CloudinaryConfiguration)
  CLOUDINARY_CONFIG: CloudinaryConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['MEDIA_PORT']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.CLOUDINARY_CONFIG = new CloudinaryConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = typeof CONFIGURATION;

CONFIGURATION.validate();
