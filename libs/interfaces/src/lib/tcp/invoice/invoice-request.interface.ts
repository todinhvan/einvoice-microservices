import { CreateInvoiceRequestDTO } from '../../gateway/invoice/invoice-request.dto';

export type CreateInvoiceTcpRequest = CreateInvoiceRequestDTO;

export type SendInvoiceTcpRequest = {
  invoiceId: string;
  userId: string;
};
