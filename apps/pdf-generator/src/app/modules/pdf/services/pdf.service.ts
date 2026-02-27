import { Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import ejs from 'ejs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generateHtmlFromEjs(templatePath: string, data: any) {
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(ErrorMessages.TEMPLATE_FILE_NOT_FOUND);
    }

    const html = await ejs.renderFile<string>(fullPath, data);
    return await this.generatePdfFromHtml(html);
  }

  private async generatePdfFromHtml(html: string): Promise<Uint8Array<ArrayBufferLike>> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();
    return pdfBuffer;
  }
}
