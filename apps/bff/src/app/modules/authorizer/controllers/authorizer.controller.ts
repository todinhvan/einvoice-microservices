import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { LoginRequestDTO, LoginTCP } from '@shared/contracts/authorizer/authorizer-request.type';
import { ProcessId } from '@shared/decorators/process-id.decorator';
import { firstValueFrom, map } from 'rxjs';
import { LoginResponse } from '@shared/contracts/authorizer/authorizer-response.type';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';

@Controller('authorizer')
@ApiTags('Authorizer')
export class AuthorizerController {
  constructor(@Inject(TcpServices.AUTHORIZER) private readonly authorizerClient: TcpClient) {}

  @Post('login')
  async login(@Body() request: LoginRequestDTO, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.authorizerClient
        .send<LoginResponse, LoginTCP>(TcpMessages.AUTHORIZER.LOGIN, { processId, data: request })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }
}
