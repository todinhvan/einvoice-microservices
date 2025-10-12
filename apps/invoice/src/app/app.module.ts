import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MongooseModule.forRoot('mongodb://root:password@localhost:27017/'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
