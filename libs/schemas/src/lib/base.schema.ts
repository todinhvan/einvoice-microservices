import { ObjectId } from 'mongodb';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { Schema } from 'mongoose';

export class BaseSchema {
  _id: ObjectId;

  @Virtual({
    get: (docs) => docs?._id?.toString(),
  })
  id: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const createSchema = <TClass = any>(target: Type<TClass>): Schema<TClass> => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('timestamps', true);
  schema.set('versionKey', false);
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });

  return schema;
};
