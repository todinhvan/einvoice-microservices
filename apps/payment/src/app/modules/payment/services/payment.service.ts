import { Injectable } from '@nestjs/common';
import { StripeService } from '../../stripe/services/stripe.service';
import { Invoice } from '@shared/schemas/invoice.schema';
import { toCheckoutSessionRequest } from '../mappers/payment.mapper';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createCheckoutSession(data: Invoice) {
    const params = toCheckoutSessionRequest(data);
    const result = await this.stripeService.createCheckoutSession(params);
    return result;
  }

  async expireCheckoutSession(sessionId: string) {
    await this.stripeService.expireCheckoutSession(sessionId);
  }
}
