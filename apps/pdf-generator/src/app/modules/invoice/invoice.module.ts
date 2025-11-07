import { Module } from '@nestjs/common';
import { InvoicePdfController } from './controllers/invoice-pdf.controller';
import { InvoicePdfService } from './services/invoice-pdf.service';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [PdfModule],
  controllers: [InvoicePdfController],
  providers: [InvoicePdfService],
})
export class InvoiceModule {}
