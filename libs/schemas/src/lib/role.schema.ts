import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { ROLE } from '@common/constants/enums/role.enum';
import { PERMISSION } from '@common/constants/enums/permission.enum';
import { Model } from 'mongoose';

@Schema({ collection: 'role' })
export class Role extends BaseSchema {
  @Prop({ type: String, enum: ROLE, unique: true, default: ROLE.ACCOUNTANT })
  name: ROLE;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String], enum: PERMISSION, default: [] })
  permissions: PERMISSION[];
}

export const RoleSchema = createSchema(Role);
export const RoleModelName = Role.name;
export const RoleDestination = {
  name: RoleModelName,
  schema: RoleSchema,
};

export type TRoleModel = Model<Role>;
