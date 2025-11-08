export type CreateCheckoutSessionRequest = {
  invoiceId: string;
  clientEmail: string;
  lineItems: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

export type StripeWebhookParams = {
  processId: string;
  signature: string;
  rawBody: Buffer;
};
