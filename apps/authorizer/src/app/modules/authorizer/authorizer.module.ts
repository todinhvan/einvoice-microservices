import { Module } from '@nestjs/common';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerService } from './services/authorizer.service';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { UserGrpcController } from './controllers/authorizer-grpc.controller';
import { GrpcProvider } from '@shared/configurations/grpc.config';
import { GrpcServices } from '@shared/constants/enums/grpc-service.enum';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GrpcServices.USER_ACCESS)])],
  controllers: [AuthorizerController, UserGrpcController],
  providers: [AuthorizerService, TcpProvider(TcpServices.USER_ACCESS)],
})
export class AuthorizerModule {}
