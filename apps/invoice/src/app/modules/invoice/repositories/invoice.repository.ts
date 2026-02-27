import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDefinition } from '@shared/schemas/invoice.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceDefinition.name) private readonly model: Model<Invoice>) {}

  create(invoice: Invoice) {
    return this.model.create(invoice);
  }

  findById(id: ObjectId) {
    return this.model.findById(id).exec();
  }

  findAll() {
    return this.model.find().exec();
  }

  updateById(id: ObjectId, invoice: Partial<Invoice>) {
    return this.model.updateOne({ _id: id }, { $set: invoice }).exec();
  }
}
