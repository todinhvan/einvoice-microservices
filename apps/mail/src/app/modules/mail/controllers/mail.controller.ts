import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { MailService } from '../services/mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('invoice-sent')
  async invoiceSendEvent(@Payload() payload: { invoiceId: string; clientEmail: string }, @Ctx() context: KafkaContext) {
    await this.mailService.sendMail({
      to: payload.clientEmail,
      subject: 'Your Invoice has been Sent',
      text: `Invoice: ${payload.invoiceId} has been successfully sent to your email.`,
    });
  }
}
