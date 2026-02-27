import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { InvoiceService } from '../services/invoice.service';
import { RequestTCP, ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import {
  ChangeInvoiceStatusTCP,
  CreateInvoiceTCP,
  SendInvoiceTCP,
} from '@shared/contracts/invoice/invoice-request.type';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { AuthData } from '@shared/decorators/auth-data.decorator';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TcpMessages.INVOICE.CREATE)
  async createInvoice(@RequestParams() params: RequestTCP<CreateInvoiceTCP>) {
    const invoice = await this.invoiceService.createInvoice(params.data, params.processId);
    return ResponseTCP.success(invoice);
  }

  @MessagePattern(TcpMessages.INVOICE.SEND)
  async sendInvoice(@RequestParams() params: RequestTCP<SendInvoiceTCP>, @AuthData('userId') userId: string) {
    const result = await this.invoiceService.sendInvoice(params.data, params.processId, userId);
    return ResponseTCP.success(result);
  }

  @MessagePattern(TcpMessages.INVOICE.CHANGE_STATUS)
  async changeInvoiceStatus(@RequestParams('data') data: ChangeInvoiceStatusTCP) {
    await this.invoiceService.changeStatus(data);
    return ResponseTCP.success(HttpMessages.UPDATED);
  }

  @MessagePattern(TcpMessages.INVOICE.GET)
  async getInvoice(@RequestParams('data') data: string) {
    const invoice = await this.invoiceService.getInvoice(data);
    return ResponseTCP.success(invoice);
  }

  @MessagePattern(TcpMessages.INVOICE.GET_ALL)
  async getInvoices() {
    const invoices = await this.invoiceService.getInvoices();
    return ResponseTCP.success(invoices);
  }
}
