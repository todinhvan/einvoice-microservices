import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { UserService } from '../services/user.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { CreateUserTcpRequest, UserTcpResponse } from '@common/interfaces/tcp/user';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { HttpMessage } from '@common/constants/enums/http-message.constant';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@RequestParams() params: CreateUserTcpRequest) {
    await this.userService.create(params);
    return Response.success<string>(HttpMessage.CREATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.GET_ALL)
  async getAll() {
    const users = await this.userService.getAll();
    return Response.success<UserTcpResponse[]>(users);
  }
}
