import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, ConfigurationType } from '../configuration';
import { MongoProvider } from '@shared/configurations/mongo.config';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MongoProvider,
    RoleModule,
    UserModule,
  ],
})
export class AppModule {
  static Configuration: ConfigurationType = CONFIGURATION;
}
