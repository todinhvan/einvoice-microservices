import { INVOICE_STATUS } from '@common/constants/enums/invoice.enum';
import { Invoice, InvoiceModelName, TInvoiceModel } from '@common/schemas/invoice.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: TInvoiceModel) {}

  create(data: Partial<Invoice>) {
    return this.invoiceModel.create({
      ...data,
      status: INVOICE_STATUS.CREATED,
    });
  }

  findById(id: string) {
    return this.invoiceModel.findById(id);
  }

  updateById(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  changeStatus(id: string, status: INVOICE_STATUS) {
    return this.invoiceModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  deleteById(id: string) {
    return this.invoiceModel.findByIdAndDelete(id);
  }
}
