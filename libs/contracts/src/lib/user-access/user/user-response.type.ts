import { ApiProperty } from '@nestjs/swagger';
import { SchemaResponse } from '../../common/schema-response.type';
import { RoleResponse } from '../role/role-response.type';

export class UserResponse extends SchemaResponse {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  keycloakUserId: string;

  @ApiProperty({ type: [RoleResponse] })
  roles: RoleResponse[];
}

export type UserGrpcResponse = UserResponse;
