import { Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generatePdfFromEjs(templatePath: string, data: any) {
    const html = await this.renderEjsTemplate(templatePath, data);
    return this.generatePdfFromHtml(html);
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

  private renderEjsTemplate(templatePath: string, data: any): Promise<string> {
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Template file not found');
    }
    return ejs.renderFile(fullPath, data);
  }
}
