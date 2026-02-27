export enum QueueGroups {
  MAIL = 'mail',
}

export enum QueueServices {
  BFF = 'bff',
  INVOICE = 'invoice',
}

enum INVOICE {
  SENT = 'invoice.sent',
}

export const QueueEvents = {
  INVOICE,
};
