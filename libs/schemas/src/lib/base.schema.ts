import { ObjectId } from 'mongodb';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';

export class BaseSchema {
  _id: ObjectId;

  @Virtual({ get: (docs: any) => docs?._id?.toString() })
  id: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}
export const createSchema = <TClass = any>(target: Type<TClass>) => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.set('toObject', {
    virtuals: true,
  });
  schema.set('versionKey', false);
  schema.set('timestamps', true);

  return schema;
};
