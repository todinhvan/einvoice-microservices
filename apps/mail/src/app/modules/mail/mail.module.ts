import { Module } from '@nestjs/common';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
