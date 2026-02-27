import { Module } from '@nestjs/common';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [RoleController, UserController],
  providers: [TcpProvider(TcpServices.USER_ACCESS)],
})
export class UserAccessModule {}
