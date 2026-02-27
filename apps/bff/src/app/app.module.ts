/* eslint-disable @nx/enforce-module-boundaries */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { LoggerMiddleware } from '@shared/middlewares/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@shared/interceptors/response.interceptor';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { UserAccessModule } from './modules/user-access/user-access.module';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
import { UserGuard } from '@shared/guards/user.guard';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { RedisProvider } from '@shared/configurations/redis.config';
import { ThrottlerProvider } from '@shared/configurations/throttler.config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GrpcProvider } from '@shared/configurations/grpc.config';
import { GrpcServices } from '@shared/constants/enums/grpc-service.enum';
import { WebhookModule } from './modules/webhook/webhook.module';
import { LoggerModule } from '@shared/observability/logger/logger.module';
import { ServiceName } from '@shared/constants/enums/common.enum';
import { MetricsModule } from '@shared/observability/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    ClientsModule.registerAsync([GrpcProvider(GrpcServices.AUTHORIZER)]),
    ProductModule,
    InvoiceModule,
    UserAccessModule,
    AuthorizerModule,
    WebhookModule,
    RedisProvider,
    ThrottlerProvider,
    LoggerModule.forRoot(ServiceName.BFF),
    MetricsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TcpProvider(TcpServices.AUTHORIZER),
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path'); // localhost:4000/api/v1/*
  }
}
