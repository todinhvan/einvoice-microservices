import { BaseConfiguration } from '@shared/configurations/base.config';
import { AppConfiguration } from '@shared/configurations/app.config';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { KeycloakConfiguration } from '@shared/configurations/keycloak.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GrpcConfiguration } from '@shared/configurations/grpc.config';

class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG: AppConfiguration;

  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_CONFIG: TcpConfiguration;

  @ValidateNested()
  @Type(() => KeycloakConfiguration)
  KEYCLOAK_CONFIG: KeycloakConfiguration;

  @ValidateNested()
  @Type(() => GrpcConfiguration)
  GRPC_CONFIG: GrpcConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['AUTHORIZER_PORT']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.KEYCLOAK_CONFIG = new KeycloakConfiguration();
    this.GRPC_CONFIG = new GrpcConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
