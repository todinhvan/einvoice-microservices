import { ClientsProviderAsyncOptions, GrpcOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
import { GrpcServices } from '@shared/constants/enums/grpc-service.enum';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export class GrpcConfiguration {
  @IsObject()
  @IsNotEmpty()
  GRPC_AUTHORIZER: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_USER_ACCESS: GrpcOptions & { name: string };

  constructor() {
    Object.entries(GrpcServices).forEach(([key, serviceName]) => {
      const host = process.env[`${key}_HOST`];
      const port = Number(process.env[`${serviceName}_PORT`]);
      const protoPaths = ['./proto/authorizer.proto', './proto/user-access.proto'];

      this[serviceName] = {
        name: serviceName,
        transport: Transport.GRPC,
        options: {
          package: serviceName,
          protoPath: protoPaths.map((path) => join(__dirname, path)),
          url: `${host}:${port}`,
        },
      };
    });
  }
}

export const GrpcProvider = (serviceName: keyof GrpcConfiguration): ClientsProviderAsyncOptions => {
  return {
    name: serviceName,
    inject: [ConfigService],
    useFactory: (config: ConfigService): GrpcOptions & { name: string } => {
      return config.get(`GRPC_CONFIG.${serviceName}`) as GrpcOptions & { name: string };
    },
  };
};
