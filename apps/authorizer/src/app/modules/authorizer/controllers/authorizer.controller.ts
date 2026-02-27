import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { AuthorizerService } from '../services/authorizer.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import { CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { RequestTCP, ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { LoginTCP } from '@shared/contracts/authorizer/authorizer-request.type';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class AuthorizerController {
  constructor(private readonly auhorizerService: AuthorizerService) {}

  @MessagePattern(TcpMessages.AUTHORIZER.CREATE_KEYCLOAK_USER)
  async createUser(@RequestParams('data') data: CreateUserTCP) {
    const userId = await this.auhorizerService.createUser(data);
    return ResponseTCP.success(userId);
  }

  @MessagePattern(TcpMessages.AUTHORIZER.LOGIN)
  async exchangeUserToken(@RequestParams('data') data: LoginTCP) {
    const result = await this.auhorizerService.exchangeUserToken(data);
    return ResponseTCP.success(result);
  }

  @MessagePattern(TcpMessages.AUTHORIZER.VERIFY_TOKEN)
  async verifyToken(@RequestParams() request: RequestTCP<string>) {
    const result = await this.auhorizerService.verifyToken(request.data, request.processId);
    return ResponseTCP.success(result);
  }
}
