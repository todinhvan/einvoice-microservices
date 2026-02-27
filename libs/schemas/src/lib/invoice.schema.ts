import { Prop, Schema } from '@nestjs/mongoose';
import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';
import { BaseSchema, createSchema } from './base.schema';
import { ObjectId } from 'mongodb';

export class Client {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  address: string;
}

export class Item {
  @Prop({ type: Number })
  productId: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  unitPrice: number;

  @Prop({ type: Number })
  vatRate: number;

  @Prop({ type: Number })
  total: number;
}

@Schema({ collection: 'invoice' })
export class Invoice extends BaseSchema {
  @Prop({ type: Client })
  client: Client;

  @Prop({ type: [Item] })
  items: Item[];

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({ type: Number })
  vatAmount: number;

  @Prop({ type: String, enum: InvoiceStatuses, default: InvoiceStatuses.CREATED })
  status: InvoiceStatuses;

  @Prop({ type: ObjectId, required: false })
  supervisorId?: ObjectId;

  @Prop({ type: String, required: false })
  fileUrl?: string;
}

const InvoiceSchema = createSchema(Invoice);
export const InvoiceDefinition = {
  name: Invoice.name,
  schema: InvoiceSchema,
};
