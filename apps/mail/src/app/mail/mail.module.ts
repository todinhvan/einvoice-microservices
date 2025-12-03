import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [],
})
export class MailModule {}
