import { CreateCheckoutSessionRequest } from '@shared/contracts/payment/stripe-request.type';
import { Invoice } from '@shared/schemas/invoice.schema';

export const toCheckoutSessionRequest = (invoice: Invoice): CreateCheckoutSessionRequest => {
  return {
    invoiceId: invoice.id,
    clientEmail: invoice.client.email,
    lineItems: invoice.items.map((item) => ({
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
    })),
  };
};
