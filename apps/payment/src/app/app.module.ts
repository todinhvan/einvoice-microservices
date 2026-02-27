import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { StripeModule } from './modules/stripe/stripe.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    StripeModule,
    PaymentModule,
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;
}
