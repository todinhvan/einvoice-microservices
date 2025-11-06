import { Controller, Get } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import path from 'path';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  getPdf() {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');
    return this.pdfService.generatePdfFromEjs(templatePath, { invoice: { id: 1 } });
  }
}
