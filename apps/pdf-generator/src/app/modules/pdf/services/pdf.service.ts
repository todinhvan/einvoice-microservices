import { Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';

@Injectable()
export class PdfService {
  async generatePdfFromEjs(templatePath: string, data: any) {
    const html = await this.renderEjsTemplate(templatePath, data);
    return { html };
  }

  private renderEjsTemplate(templatePath: string, data: any) {
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Template file not found');
    }
    return ejs.renderFile(fullPath, data);
  }
}
