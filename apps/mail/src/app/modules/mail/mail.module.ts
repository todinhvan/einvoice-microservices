import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailController } from './controllers/mail.controller';
import { MailTemplateService } from './services/mail-template.service';
import { MailInvoiceService } from './services/mail-invoice.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService, MailTemplateService, MailInvoiceService],
})
export class MailModule {}
