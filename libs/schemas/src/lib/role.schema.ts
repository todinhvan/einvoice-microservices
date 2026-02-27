import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { ROLE } from '@shared/constants/enums/role.enum';
import { PERMISSION } from '@shared/constants/enums/permission.enum';

@Schema({ collection: 'role' })
export class Role extends BaseSchema {
  @Prop({ type: String, enum: ROLE, default: ROLE.ACCOUNTANT })
  name: ROLE;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String], enum: PERMISSION, default: [] })
  permissions: PERMISSION[];
}

const RoleSchema = createSchema(Role);
export const RoleDefinition = {
  name: Role.name,
  schema: RoleSchema,
};
