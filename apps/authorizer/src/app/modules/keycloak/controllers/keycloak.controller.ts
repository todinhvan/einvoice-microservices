import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { KeycloakHttpService } from '../services/keycloak-http.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { CreateKeyCloakUserTcpRequest } from '@common/interfaces/tcp/keycloak';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class KeycloakController {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER)
  async createUser(@RequestParams() params: CreateKeyCloakUserTcpRequest) {
    const userId = await this.keycloakHttpService.createUser(params);
    return Response.success<string>(userId);
  }
}
