import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { Logger } from '@nestjs/common';

export class MongoConfiguration {
  @IsString()
  @IsNotEmpty()
  URI: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsNumber()
  MAX_POOL_SIZE: number;

  @IsNumber()
  CONNECT_TIMEOUT_MS: number;

  @IsNumber()
  SOCKET_TIMEOUT_MS: number;

  constructor(data: Partial<MongoConfiguration> & { URI: string; DATABASE_NAME: string }) {
    this.URI = data.URI;
    this.DATABASE_NAME = data.DATABASE_NAME;
    this.MAX_POOL_SIZE = data.MAX_POOL_SIZE || Number(process.env['MONGO_MAX_POOL_SIZE']) || 10;
    this.CONNECT_TIMEOUT_MS = data.CONNECT_TIMEOUT_MS || Number(process.env['MONGO_CONNECTION_TIMEOUT_MS']) || 30000;
    this.SOCKET_TIMEOUT_MS = data.SOCKET_TIMEOUT_MS || Number(process.env['MONGO_SOCKET_TIMEOUT_MS']) || 60000;
  }
}

export const MongoProvider = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.get<string>('MONGO_CONFIG.URI'),
    dbName: config.get<string>('MONGO_CONFIG.DATABASE_NAME'),
    maxPoolSize: config.get<number>('MONGO_CONFIG.MAX_POOL_SIZE'),
    connectTimeoutMS: config.get<number>('MONGO_CONFIG.CONNECT_TIMEOUT_MS'),
    socketTimeoutMS: config.get<number>('MONGO_CONFIG.SOCKET_TIMEOUT_MS'),
    onConnectionCreate: (connection: Connection) => {
      connection.on('connected', () => Logger.log('Connected to MongoDB'));
      connection.on('open', () => Logger.log('MongoDB opened connection'));
      connection.on('disconnected', () => Logger.log('MongoDB disconnected'));

      return connection;
    },
  }),
});
