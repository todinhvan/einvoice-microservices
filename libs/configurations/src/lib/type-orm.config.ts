import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export class TypeOrmConfiguration {
  @IsString()
  @IsNotEmpty()
  TYPE: DatabaseType;

  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  USERNAME: string;

  @IsString()
  @IsNotEmpty()
  PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  constructor(data: TypeOrmConfiguration) {
    this.TYPE = data.TYPE;
    this.HOST = data.HOST;
    this.PORT = data.PORT;
    this.USERNAME = data.USERNAME;
    this.PASSWORD = data.PASSWORD;
    this.DATABASE_NAME = data.DATABASE_NAME;
  }
}

export const TypeOrmProvider = (entities: EntityClassOrSchema[]) => {
  return TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
      ({
        type: config.get<DatabaseType>('TYPEORM_CONFIG.TYPE'),
        host: config.get<string>('TYPEORM_CONFIG.HOST'),
        port: config.get<number>('TYPEORM_CONFIG.PORT'),
        username: config.get<string>('TYPEORM_CONFIG.USERNAME'),
        password: config.get<string>('TYPEORM_CONFIG.PASSWORD'),
        database: config.get<string>('TYPEORM_CONFIG.DATABASE_NAME'),
        entities,
        synchronize: true,
        autoLoadEntities: true,
      }) as TypeOrmModuleOptions,
  });
};
