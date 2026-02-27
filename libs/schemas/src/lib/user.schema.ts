import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { ObjectId } from 'mongodb';
import { Role } from './role.schema';

@Schema({ collection: 'user' })
export class User extends BaseSchema {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  keycloakUserId: string;

  @Prop({ type: [ObjectId], ref: 'Role' })
  roles: ObjectId[];
}

const UserSchema = createSchema(User);
export const UserDefinition = {
  name: User.name,
  schema: UserSchema,
};

export type UserPopulated = Omit<User, 'roles'> & {
  roles: Role[];
};
