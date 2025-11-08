import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionRequest } from '@common/interfaces/common';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return await this.stripeService.createCheckoutSession(params);
  }
}
