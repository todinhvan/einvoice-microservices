import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';
import { CreateInvoiceTCP } from '@shared/contracts/invoice/invoice-request.type';
import { ProductResponse } from '@shared/contracts/product/product-response.type';
import { Invoice, Item } from '@shared/schemas/invoice.schema';
import { ClientResponse, InvoiceResponse, ItemResponse } from '@shared/contracts/invoice/invoice-response.type';

export const toItem = (response: ProductResponse & { quantity: number }): Item => {
  const item = new Item();
  item.productId = response.id;
  item.quantity = response.quantity;
  item.name = response.name;
  item.unitPrice = response.price;
  item.vatRate = response.vatRate;
  item.total = response.quantity * response.price;
  return item;
};

export const toInvoice = (data: CreateInvoiceTCP, items: Item[]): Invoice => {
  const invoice = new Invoice();
  invoice.client = data.client;
  invoice.items = items;
  invoice.totalAmount = items.reduce((total, item) => total + item.total, 0);
  invoice.vatAmount = items.reduce((total, item) => total + item.total * (item.vatRate / 100), 0);
  invoice.status = InvoiceStatuses.CREATED;
  return invoice;
};

export const toInvoiceResponse = (invoice: Invoice): InvoiceResponse => {
  const clientResponse = new ClientResponse();
  clientResponse.name = invoice.client.name;
  clientResponse.email = invoice.client.email;
  clientResponse.address = invoice.client.address;

  const itemsResponse = invoice.items.map((item) => {
    const itemResponse = new ItemResponse();
    itemResponse.productId = item.productId;
    itemResponse.name = item.name;
    itemResponse.quantity = item.quantity;
    itemResponse.total = item.total;
    itemResponse.unitPrice = item.unitPrice;
    itemResponse.vatRate = item.vatRate;
    return itemResponse;
  });

  const response = new InvoiceResponse();
  response.id = invoice.id;
  response.client = clientResponse;
  response.items = itemsResponse;
  response.totalAmount = invoice.totalAmount;
  response.vatAmount = invoice.vatAmount;
  response.status = invoice.status;
  response.supervisorId = invoice.supervisorId;
  response.fileUrl = invoice.fileUrl;
  response.createdAt = invoice.createdAt;
  response.updatedAt = invoice.updatedAt;

  return response;
};
