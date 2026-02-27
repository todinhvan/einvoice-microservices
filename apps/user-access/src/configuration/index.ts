import { AppConfiguration } from '@shared/configurations/app.config';
import { BaseConfiguration } from '@shared/configurations/base.config';
import { MongoConfiguration } from '@shared/configurations/mongo.config';
import { TcpConfiguration } from '@shared/configurations/tcp.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GrpcConfiguration } from '@shared/configurations/grpc.config';

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
  @Type(() => GrpcConfiguration)
  GRPC_CONFIG: GrpcConfiguration;

  constructor() {
    super();
    this.APP_CONFIG = new AppConfiguration({
      PORT: Number(process.env['USER_ACCESS_PORT']),
      HASH_SALT_ROUNDS: Number(process.env['HASH_SALT_ROUNDS']),
    });
    this.TCP_CONFIG = new TcpConfiguration();
    this.MONGO_CONFIG = new MongoConfiguration({
      URI: process.env['USER_ACCESS_DB_URI'],
      DATABASE_NAME: process.env['USER_ACCESS_DB_NAME'],
    });
    this.GRPC_CONFIG = new GrpcConfiguration();
  }
}

export const CONFIGURATION = new Configuration();
export type ConfigurationType = Configuration;

CONFIGURATION.validate();
