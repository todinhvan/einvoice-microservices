import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDefinition } from '@shared/schemas/user.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { UserGrpcController } from './controllers/user-grpc.controller';

@Module({
  imports: [MongooseModule.forFeature([UserDefinition])],
  controllers: [UserController, UserGrpcController],
  providers: [UserService, UserRepository, TcpProvider(TcpServices.AUTHORIZER)],
})
export class UserModule {}
