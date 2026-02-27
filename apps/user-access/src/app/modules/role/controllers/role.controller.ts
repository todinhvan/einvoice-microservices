import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { RoleService } from '../services/role.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern(TcpMessages.ROLE.GET_ALL)
  async getAllRoles() {
    const roles = await this.roleService.getAllRoles();
    return ResponseTCP.success(roles);
  }
}
