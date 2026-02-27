import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions, TcpClientOptions, Transport } from '@nestjs/microservices';
import { HealthCheckService, MemoryHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { GrpcServices } from '@shared/constants/enums/grpc-service.enum';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  checkMemoryHeap() {
    return this.health.check([() => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024)]);
  }

  checkStartup() {
    return {
      status: HttpMessages.OK,
    };
  }

  checkReadiness() {
    const tcpServices = [
      { key: TcpServices.AUTHORIZER, configKey: 'TCP_CONFIG.TCP_AUTHORIZER' },
      { key: TcpServices.PRODUCT, configKey: 'TCP_CONFIG.TCP_PRODUCT' },
      { key: TcpServices.INVOICE, configKey: 'TCP_CONFIG.TCP_INVOICE' },
      { key: TcpServices.USER_ACCESS, configKey: 'TCP_CONFIG.TCP_USER_ACCESS' },
      { key: TcpServices.PDF_GENERATOR, configKey: 'TCP_CONFIG.TCP_PDF_GENERATOR' },
      { key: TcpServices.MEDIA, configKey: 'TCP_CONFIG.TCP_MEDIA' },
      { key: TcpServices.PAYMENT, configKey: 'TCP_CONFIG.TCP_PAYMENT' },
    ];

    const grpcServices = [
      { key: GrpcServices.AUTHORIZER, configKey: 'GRPC_CONFIG.GRPC_AUTHORIZER' },
      { key: GrpcServices.USER_ACCESS, configKey: 'GRPC_CONFIG.GRPC_USER_ACCESS' },
    ];

    return this.health.check([
      ...tcpServices.map((service) => () => this.checkTcpService(service.key, service.configKey)),
      ...grpcServices.map((service) => () => this.checkGrpcService(service.key, service.configKey)),
      () => this.checkRedisServer(),
    ]);
  }

  private checkTcpService(key: string, configKey: string) {
    return this.microservice.pingCheck<TcpClientOptions>(key, {
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>(`${configKey}.options.host`),
        port: this.configService.get<number>(`${configKey}.options.port`),
      },
    });
  }

  private checkGrpcService(key: string, configKey: string) {
    const url = this.configService.get<string>(`${configKey}.options.url`);
    const [host, port] = url.split(':');
    return this.microservice.pingCheck<TcpClientOptions>(key, {
      transport: Transport.TCP,
      options: {
        host,
        port: Number(port),
      },
    });
  }

  private checkRedisServer() {
    return this.microservice.pingCheck<RedisOptions>('redis', {
      transport: Transport.REDIS,
      options: {
        host: this.configService.get<string>('REDIS_CONFIG.HOST'),
        port: this.configService.get<number>('REDIS_CONFIG.PORT'),
      },
    });
  }
}
