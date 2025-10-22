import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthorizerService } from '../services/authorizer.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
  async login(@RequestParams() params: LoginTcpRequest) {
    console.log('AuthorizerController - login called with params:', params);
    const result = await this.authorizerService.login(params);
    return Response.success<LoginTcpResponse>(result);
  }
}
