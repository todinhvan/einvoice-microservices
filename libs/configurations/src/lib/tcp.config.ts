import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, TcpClientOptions, Transport } from '@nestjs/microservices';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { IsNotEmpty, IsObject } from 'class-validator';
import { createTracingClientProxy } from '@shared/observability/tracing';

export class TcpConfiguration {
  @IsObject()
  @IsNotEmpty()
  TCP_PRODUCT: TcpClientOptions;

  @IsObject()
  @IsNotEmpty()
  TCP_INVOICE: TcpClientOptions;

  @IsObject()
  @IsNotEmpty()
  TCP_USER_ACCESS: TcpClientOptions;

  @IsObject()
  @IsNotEmpty()
  TCP_AUTHORIZER: TcpClientOptions;

  @IsObject()
  @IsNotEmpty()
  TCP_PDF_GENERATOR: TcpClientOptions;

  @IsObject()
  @IsNotEmpty()
  TCP_MEDIA: TcpClientOptions;

  @IsObject()
  @IsNotEmpty()
  TCP_PAYMENT: TcpClientOptions;

  constructor() {
    Object.entries(TcpServices).forEach(([key, serviceName]) => {
      const host = process.env[`${key}_HOST`];
      const port = Number(process.env[`${serviceName}_PORT`]);
      this[serviceName] = {
        transport: Transport.TCP,
        options: {
          host,
          port,
        },
      };
    });
  }
}

export const TcpProvider = (serviceName: keyof TcpConfiguration): Provider => {
  return {
    provide: serviceName,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const option = config.get(`TCP_CONFIG.${serviceName}`) as TcpClientOptions;
      const client = ClientProxyFactory.create(option);
      return createTracingClientProxy(client);
    },
  };
};
