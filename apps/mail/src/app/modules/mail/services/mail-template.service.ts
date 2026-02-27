import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';
import { join } from 'path';

@Injectable()
export class MailTemplateService {
  private templateDir = join(__dirname, 'templates');

  async render(templateName: string, data: any) {
    const body = await renderFile(join(this.templateDir, `${templateName}.template.ejs`), data);
    const html = await renderFile(join(this.templateDir, 'layout.template.ejs'), { content: body });
    return html;
  }
}
