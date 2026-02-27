import { Injectable } from '@nestjs/common';
import { PdfService } from '../../pdf/services/pdf.service';
import { Invoice } from '@shared/schemas/invoice.schema';
import path from 'path';

@Injectable()
export class InvoiceService {
  constructor(private readonly pdfService: PdfService) {}

  async generateInvoicePdf(invoice: Invoice) {
    const templatePath = path.join(__dirname + '/templates/invoice.template.ejs');
    const subTotal = invoice.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const data = {
      client: invoice.client,
      status: invoice.status,
      items: invoice.items,
      vatAmount: invoice.vatAmount,
      totalAmount: invoice.totalAmount + invoice.vatAmount,
      subtotal: subTotal,
    };

    const pdfBuffer = await this.pdfService.generateHtmlFromEjs(templatePath, data);
    return Buffer.from(pdfBuffer).toString('base64');
  }
}
