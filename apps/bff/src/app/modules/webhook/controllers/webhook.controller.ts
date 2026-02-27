import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { ProcessId } from '@shared/decorators/process-id.decorator';
import { StripeWebhookService } from '../services/stripe-webhook.service';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';

@Controller('webhook')
@ApiTags('Webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOkResponse({ type: ResponseDTO<string> })
  @ApiOperation({ summary: 'Webhook call from Stripe' })
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    await this.stripeWebhookService.processWebhook({ processId, signature, rawBody: request.rawBody });
    return ResponseDTO.ok(HttpMessages.SENT);
  }
}
