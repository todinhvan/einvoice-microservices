import { Module } from '@nestjs/common';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { AuthorizerController } from './controllers/authorizer.controller';

@Module({
  controllers: [AuthorizerController],
  providers: [TcpProvider(TcpServices.AUTHORIZER)],
})
export class AuthorizerModule {}
