/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { LoggerModule } from '@shared/observability/logger/logger.module';
import { ServiceName } from '@shared/constants/enums/common.enum';
import { MetricsModule } from '@shared/observability/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    InvoiceModule,
    LoggerModule.forRoot(ServiceName.INVOICE),
    MetricsModule,
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;
}
