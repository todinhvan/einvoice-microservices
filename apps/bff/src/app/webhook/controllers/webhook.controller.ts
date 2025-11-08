import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeWebhookService } from '../services/stripe-webhook.service';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { Request } from 'express';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { HttpMessage } from '@common/constants/enums/http-message.constant';

@Controller('webhook')
@ApiTags('Webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOperation({
    summary: 'Handle Stripe Webhook Events',
  })
  @ApiOkResponse({
    type: ResponseDTO<string>,
  })
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    await this.stripeWebhookService.processWebhook({ processId, rawBody: request.rawBody, signature });
    return Response.success<string>(HttpMessage.OK);
  }
}
