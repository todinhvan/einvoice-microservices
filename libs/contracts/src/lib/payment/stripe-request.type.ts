export type CreateCheckoutSessionRequest = {
  lineItems: {
    name: string;
    price: number;
    quantity: number;
  }[];
  invoiceId: string;
  clientEmail: string;
};

export type StripeWebhookParams = {
  processId: string;
  signature: string;
  rawBody: Buffer;
};
