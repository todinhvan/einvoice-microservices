import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeWebhookParams } from '@shared/contracts/payment/stripe-request.type';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { ChangeInvoiceStatusTCP } from '@shared/contracts/invoice/invoice-request.type';
import { firstValueFrom, map } from 'rxjs';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(TcpServices.INVOICE) private readonly invoiceClient: TcpClient,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_CONFIG.SECRET_KEY'), {
      apiVersion: '2025-12-15.clover',
    });
  }

  async processWebhook(params: StripeWebhookParams) {
    const event = this.verifyWebhookSignature(params.signature, params.rawBody);
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        Logger.log(session);
        if (session.metadata?.invoiceId) {
          await this.changeInvoiceStatus(
            {
              invoiceId: session.metadata.invoiceId,
              status: InvoiceStatuses.PAID,
            },
            params.processId,
          );
        }
        break;
      }

      default:
        Logger.warn(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  private verifyWebhookSignature(signature: string, rawBody: Buffer<ArrayBufferLike>) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.configService.get<string>('STRIPE_CONFIG.WEBHOOK_SECRET'),
    );
  }

  private async changeInvoiceStatus(data: ChangeInvoiceStatusTCP, processId: string) {
    return await firstValueFrom(
      this.invoiceClient
        .send<string, ChangeInvoiceStatusTCP>(TcpMessages.INVOICE.CHANGE_STATUS, { processId, data })
        .pipe(map((response) => response.data)),
    );
  }
}
