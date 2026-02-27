import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    ProductModule,
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;
}
