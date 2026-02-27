import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    AuthorizerModule,
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;
}
