import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import { Invoice } from '@shared/schemas/invoice.schema';
import { InvoiceService } from '../services/invoice.service';
import { ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TcpMessages.PDF_GENERATOR.CREATE_INVOICE_PDF)
  async createInvoicePdf(@RequestParams('data') data: Invoice) {
    const result = await this.invoiceService.generateInvoicePdf(data);
    return ResponseTCP.success(result);
  }
}
