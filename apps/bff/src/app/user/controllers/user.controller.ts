import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { map } from 'rxjs';
import { CreateUserRequestDTO, UserResponseDTO } from '@common/interfaces/gateway/user';
import { CreateUserTcpRequest, UserTcpResponse } from '@common/interfaces/tcp/user';

@ApiTags('BFF for User API')
@Controller('users')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<string> })
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() data: CreateUserRequestDTO, @ProcessId() processId: string) {
    return this.userClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSAGE.USER.CREATE, {
        data,
        processId,
      })
      .pipe(map((message) => new ResponseDTO(message)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDTO<UserResponseDTO[]> })
  @ApiOperation({ summary: 'Get all users' })
  getAll(@ProcessId() processId: string) {
    return this.userClient
      .send<UserTcpResponse[]>(TCP_REQUEST_MESSAGE.USER.GET_ALL, {
        processId,
      })
      .pipe(map((users) => new ResponseDTO(users)));
  }
}
