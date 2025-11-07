import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { InvoiceService } from '../services/invoice.service';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/process-id.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const invoice = await this.invoiceService.create(params);
    return Response.success<InvoiceTcpResponse>(invoice);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
  async send(
    @RequestParams() params: SendInvoiceTcpRequest,
    @ProcessId() processId: string,
  ): Promise<Response<string>> {
    const result = await this.invoiceService.sendById(params, processId);
    return Response.success<string>(result);
  }
}
