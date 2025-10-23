import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { LoginRequestDTO, LoginResponseDTO } from '@common/interfaces/gateway/authorizer';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { Authorization } from '@common/decorators/authorizer.decorator';

@Controller('authorizer')
@ApiTags('BFF for Authorizer API')
@Authorization({ secured: false })
export class AuthorizerController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient) {}

  @Post('/login')
  @ApiOkResponse({ type: ResponseDTO<LoginResponseDTO> })
  @ApiOperation({ summary: 'Login user' })
  login(@Body() data: LoginRequestDTO, @ProcessId() processId: string) {
    return this.authorizerClient
      .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
        data,
        processId,
      })
      .pipe(map((data) => new ResponseDTO(data)));
  }
}
