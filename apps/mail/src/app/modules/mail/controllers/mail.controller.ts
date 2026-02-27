import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueEvents } from '@shared/constants/enums/queue.enum';
import { Invoice } from '@shared/schemas/invoice.schema';
import { MailInvoiceService } from '../services/mail-invoice.service';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class MailController {
  constructor(private readonly mailInvoiceService: MailInvoiceService) {}

  @EventPattern(QueueEvents.INVOICE.SENT)
  async handleSendInvoiceEvent(@Payload() payload: { invoice: Invoice; paymentLink: string }) {
    await this.mailInvoiceService.sendInvoice(payload);
  }
}
