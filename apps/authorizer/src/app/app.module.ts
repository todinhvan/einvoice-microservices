import { Module } from '@nestjs/common';
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    KeycloakModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
