import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { Invoice } from '@common/schemas/invoice.schema';

export const invoiceRequestMapping = (payload: CreateInvoiceTcpRequest): Partial<Invoice> => ({
  ...payload,
  totalAmount: payload.items.reduce((acc, item) => acc + item.total, 0),
  vatAmount: payload.items.reduce((acc, item) => acc + item.unitPrice * item.quantity * (item.vatRate / 100), 0),
});
