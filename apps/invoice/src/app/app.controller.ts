import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(invoiceId: number): Response<string> {
    return Response.success<string>(`Invoice: ${invoiceId}`);
  }
}
