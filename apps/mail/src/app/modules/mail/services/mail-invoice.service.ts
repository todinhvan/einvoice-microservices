import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { Inject, Injectable } from '@nestjs/common';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { InvoiceTcpResponse } from '@common/interfaces/tcp/invoice/invoice-response.interface';
import { InvoiceSendPayload } from '@common/interfaces/queue/invoice';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailInvoiceService {
  constructor(
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
    private readonly mailService: MailService,
    private readonly configsService: ConfigService,
  ) {}

  async sendInvoice(payload: InvoiceSendPayload) {
    const invoice = await this.getInvoiceById(payload.invoiceId);
    const html = await this.mailService.renderTemplate('invoice', {
      clientName: invoice.client.name,
      senderName: this.configsService.get('MAIL_CONFIG.SENDER_NAME'),
      invoiceCode: `#${invoice.id}`,
      paymentLink: payload.paymentLink,
    });
    await this.mailService.sendMail({
      to: invoice.client.email,
      subject: `Invoice: #${invoice.id}`,
      html,
      attachments: [
        {
          filename: `invoice-${invoice.id}.pdf`,
          path: invoice.fileUrl,
        },
      ],
    });
  }

  private getInvoiceById(id: string) {
    return firstValueFrom(
      this.invoiceClient
        .send<InvoiceTcpResponse, string>(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID, {
          data: id,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
