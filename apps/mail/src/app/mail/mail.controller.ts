import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller()
export class MailController {
  @EventPattern('invoice-sent')
  async invoiceSendEvent(@Payload() payload: any, @Ctx() context: KafkaContext) {
    Logger.log('Bla Bla Bla', { payload, context });
  }
}
