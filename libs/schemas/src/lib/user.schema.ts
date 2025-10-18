import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { createSchema } from './base.schema';
import { Model } from 'mongoose';

@Schema({ collection: 'user' })
export class User {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: [ObjectId], ref: 'Role' })
  roles: ObjectId[];
}

export const UserSchema = createSchema(User);
export const UserModelName = User.name;
export const UserDestination = {
  name: UserModelName,
  schema: UserSchema,
};

export type TUserModel = Model<User>;
