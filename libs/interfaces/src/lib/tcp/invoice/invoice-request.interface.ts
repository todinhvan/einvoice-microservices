import { INVOICE_STATUS } from '@common/constants/enums/invoice.enum';
import { CreateInvoiceRequestDTO } from '../../gateway/invoice/invoice-request.dto';

export type CreateInvoiceTcpRequest = CreateInvoiceRequestDTO;

export type SendInvoiceTcpRequest = {
  invoiceId: string;
  userId: string;
};

export type ChangeInvoiceStatusTcpRequest = {
  invoiceId: string;
  status: INVOICE_STATUS;
};
