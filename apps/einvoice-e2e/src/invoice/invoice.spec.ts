import axios from 'axios';
import { getAccessToken } from '../support/auth-helper';
import { CreateInvoiceRequestDTO } from '@shared/contracts/invoice/invoice-request.type';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { InvoiceResponse } from '@shared/contracts/invoice/invoice-response.type';
import { HttpStatus, Logger } from '@nestjs/common';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';

describe('Invoice E2E Test', () => {
  let accessToken: string;
  let clientEmail: string;

  beforeAll(async () => {
    const authData = await getAccessToken();
    accessToken = authData.accessToken;
    clientEmail = authData.clientEmail;
  });

  it('should create an invoice and send it', async () => {
    const createInvoiceDTO: CreateInvoiceRequestDTO = {
      client: {
        name: 'Test',
        email: clientEmail,
        address: 'Test',
      },
      items: [
        {
          productId: 4,
          quantity: 50,
        },
        {
          productId: 5,
          quantity: 70,
        },
      ],
    };

    Logger.log(accessToken);
    const invoiceResponse = await axios.post<ResponseDTO<InvoiceResponse>>('/invoices', createInvoiceDTO, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(invoiceResponse.data).toBeDefined();
    expect(invoiceResponse.data.status).toBe(HttpStatus.OK);
    expect(invoiceResponse.data.message).toBe(HttpMessages.OK);

    const invoice = invoiceResponse.data.data;
    expect(invoice).toBeDefined();
    expect(invoice.client.email).toBe(clientEmail);

    Logger.log(invoice.id);
    const sendInvoiceResponse = await axios.post<ResponseDTO<string>>(
      `/invoices/${invoice.id}/send`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    expect(sendInvoiceResponse.data).toBeDefined();
    expect(sendInvoiceResponse.data.status).toBe(HttpStatus.OK);
    expect(sendInvoiceResponse.data.message).toBe(HttpMessages.OK);
  }, 10000);
});
