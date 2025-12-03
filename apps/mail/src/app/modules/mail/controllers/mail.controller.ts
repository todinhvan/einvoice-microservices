import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InvoiceSendPayload } from '@common/interfaces/queue/invoice';
import { MailInvoiceService } from '../services/mail-invoice.service';

@Controller()
export class MailController {
  constructor(private readonly mailInvoiceService: MailInvoiceService) {}

  @EventPattern('invoice-sent')
  async invoiceSendEvent(@Payload() payload: InvoiceSendPayload) {
    await this.mailInvoiceService.sendInvoice(payload);
  }
}
