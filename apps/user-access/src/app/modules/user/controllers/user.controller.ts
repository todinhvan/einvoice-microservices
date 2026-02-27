import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { UserService } from '../services/user.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import { RequestTCP, ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TcpMessages.USER.CREATE)
  async createUser(@RequestParams() request: RequestTCP<CreateUserTCP>) {
    const user = await this.userService.createUser(request.data, request.processId);
    return ResponseTCP.success(user);
  }

  @MessagePattern(TcpMessages.USER.GET)
  async getUser(@RequestParams('data') data: string) {
    const user = await this.userService.getUser(data);
    return ResponseTCP.success(user);
  }

  @MessagePattern(TcpMessages.USER.GET_BY_KEYCLOAK_USER_ID)
  async getUserByKeycloakUserId(@RequestParams('data') data: string) {
    const user = await this.userService.getUserByKeycloakUserId(data);
    return ResponseTCP.success(user);
  }

  @MessagePattern(TcpMessages.USER.GET_ALL)
  async getUsers() {
    const users = await this.userService.getAllUsers();
    return ResponseTCP.success(users);
  }
}
