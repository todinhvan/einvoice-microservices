import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { Invoice } from '@shared/schemas/invoice.schema';
import { MailTemplateService } from './mail-template.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailInvoiceService {
  constructor(
    private readonly mailService: MailService,
    private readonly mailTemplateService: MailTemplateService,
    private readonly configService: ConfigService,
  ) {}

  async sendInvoice(payload: { invoice: Invoice; paymentLink: string }) {
    const { invoice, paymentLink } = payload;
    const html = await this.mailTemplateService.render('invoice', {
      clientName: invoice.client.name,
      senderName: this.configService.get<string>('MAIL_CONFIG.SENDER_NAME'),
      invoiceCode: `#${invoice.id}`,
      paymentLink: paymentLink,
    });

    this.mailService.sendMail({
      to: invoice.client.email,
      subject: 'Send Invoice',
      html,
      attachments: [
        {
          filename: `invoice-${invoice.id}.pdf`,
          path: invoice.fileUrl,
        },
      ],
    });
  }
}
