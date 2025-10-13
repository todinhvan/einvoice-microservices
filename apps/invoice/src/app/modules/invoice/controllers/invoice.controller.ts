import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { InvoiceService } from '../services/invoice.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern('get_invoice')
  getInvoice(@RequestParams() invoiceId: number, @ProcessId() processId: string): Response<string> {
    return Response.success<string>(`Invoice: ${invoiceId} from '${processId}'`);
  }
}
