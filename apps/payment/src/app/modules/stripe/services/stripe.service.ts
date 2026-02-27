import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCheckoutSessionRequest } from '@shared/contracts/payment/stripe-request.type';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_CONFIG.SECRET_KEY'), {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'amazon_pay'],
      mode: 'payment',
      success_url: this.configService.get<string>('STRIPE_CONFIG.SUCCESS_URL'),
      cancel_url: this.configService.get<string>('STRIPE_CONFIG.CANCEL_URL'),
      line_items: params.lineItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      customer_email: params.clientEmail,
      metadata: {
        invoiceId: params.invoiceId,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async expireCheckoutSession(sessionId: string) {
    await this.stripe.checkout.sessions.expire(sessionId);
  }
}
