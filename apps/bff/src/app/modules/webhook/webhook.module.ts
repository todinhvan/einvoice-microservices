import { Module } from '@nestjs/common';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { WebhookController } from './controllers/webhook.controller';
import { StripeWebhookService } from './services/stripe-webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [StripeWebhookService, TcpProvider(TcpServices.INVOICE)],
})
export class WebhookModule {}
