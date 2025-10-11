import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { map } from 'rxjs';
import { ProcessId } from '@common/decorators/process-id.decorator';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDTO({ data: result });
  }

  @Get('invoice')
  async getInvoice(@ProcessId() processId: string) {
    return await this.invoiceClient
      .send<string, number>('get_invoice', {
        data: 1,
        processId,
      })
      .pipe(map((data) => new ResponseDTO<string>(data)));
  }
}
