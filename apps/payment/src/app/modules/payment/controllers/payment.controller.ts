import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { PaymentService } from '../services/payment.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import { Invoice } from '@shared/schemas/invoice.schema';
import { ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(TcpMessages.PAYMENT.STRIPE)
  async createCheckoutSession(@RequestParams('data') data: Invoice) {
    const result = await this.paymentService.createCheckoutSession(data);
    return ResponseTCP.success(result);
  }

  @MessagePattern(TcpMessages.PAYMENT.STRIPE_EXPIRE)
  async expireCheckoutSession(@RequestParams('data') data: string) {
    await this.paymentService.expireCheckoutSession(data);
    return ResponseTCP.success(HttpMessages.OK);
  }
}
