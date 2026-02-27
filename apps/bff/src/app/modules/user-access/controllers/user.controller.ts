import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { CreateUserRequestDTO, CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { UserResponse } from '@shared/contracts/user-access/user/user-response.type';
import { ProcessId } from '@shared/decorators/process-id.decorator';
import { firstValueFrom, map } from 'rxjs';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(@Inject(TcpServices.USER_ACCESS) private readonly userAccessClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<UserResponse> })
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(@Body() request: CreateUserRequestDTO, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.userAccessClient
        .send<UserResponse, CreateUserTCP>(TcpMessages.USER.CREATE, { processId, data: request })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseDTO<UserResponse> })
  @ApiOperation({ summary: 'Get a user' })
  async getUser(@Param('id') id: string, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.userAccessClient
        .send<UserResponse, string>(TcpMessages.USER.GET, { processId, data: id })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Get()
  @ApiOkResponse({ type: ResponseDTO<UserResponse[]> })
  @ApiOperation({ summary: 'Get all users' })
  async getUsers(@ProcessId() processId: string) {
    return await firstValueFrom(
      this.userAccessClient
        .send<UserResponse[], null>(TcpMessages.USER.GET_ALL, { processId })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }
}
