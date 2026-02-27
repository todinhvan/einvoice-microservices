import { Module } from '@nestjs/common';
import { PdfModule } from '../pdf/pdf.module';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  imports: [PdfModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
