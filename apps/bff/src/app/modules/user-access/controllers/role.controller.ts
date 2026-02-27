import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { ProcessId } from '@shared/decorators/process-id.decorator';
import { firstValueFrom, map } from 'rxjs';
import { RoleResponse } from '@shared/contracts/user-access/role/role-response.type';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';

@Controller('roles')
@ApiTags('Role')
export class RoleController {
  constructor(@Inject(TcpServices.USER_ACCESS) private readonly userAccessClient: TcpClient) {}

  @Get()
  @ApiOkResponse({ type: ResponseDTO<RoleResponse> })
  @ApiOperation({ summary: 'Get all roles' })
  async getRoles(@ProcessId() processId: string) {
    return await firstValueFrom(
      this.userAccessClient
        .send<RoleResponse, null>(TcpMessages.ROLE.GET_ALL, {
          processId,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }
}
