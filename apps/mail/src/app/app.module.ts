import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MailModule,
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;
}
