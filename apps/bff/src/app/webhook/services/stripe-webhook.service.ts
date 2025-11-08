import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeWebhookParams } from '@common/interfaces/common';
import { ChangeInvoiceStatusTcpRequest } from '@common/interfaces/tcp/invoice';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { INVOICE_STATUS } from '@common/constants/enums/invoice.enum';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);
  private stripe: Stripe;

  constructor(
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
    private readonly congifService: ConfigService,
  ) {
    this.stripe = new Stripe(this.congifService.get('STRIPE_CONFIG.WEBHOOK_SECRET'), {
      apiVersion: '2025-10-29.clover',
    });
  }

  async processWebhook(params: StripeWebhookParams) {
    const event = this.verifyWebhookSignature(params.signature, params.rawBody);
    this.logger.debug('Received Stripe webhook event: ', JSON.stringify(event, null, 2));

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.invoiceId) {
          this.logger.log(`Processing completed checkout session for invoice ID: ${session.metadata.invoiceId}`);
          await this.changeInvoiceStatus(
            {
              invoiceId: session.metadata.invoiceId,
              status: INVOICE_STATUS.PAID,
            },
            params.processId,
          );
        }
        break;
      }

      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  verifyWebhookSignature(signature: string, rawBody: Buffer) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.congifService.get('STRIPE_CONFIG.WEBHOOK_SECRET'),
    );
  }

  changeInvoiceStatus(data: ChangeInvoiceStatusTcpRequest, processId: string) {
    return firstValueFrom(
      this.invoiceClient
        .send<string, ChangeInvoiceStatusTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CHANGE_STATUS, {
          data,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
