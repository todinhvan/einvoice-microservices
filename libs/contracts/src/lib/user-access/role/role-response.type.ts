import { ROLE } from '@shared/constants/enums/role.enum';
import { PERMISSION } from '@shared/constants/enums/permission.enum';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaResponse } from '../../common/schema-response.type';

export class RoleResponse extends SchemaResponse {
  @ApiProperty({ type: String, enum: ROLE })
  name: ROLE;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [String], enum: PERMISSION })
  permissions: PERMISSION[];
}
