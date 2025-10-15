import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceRequestDTO, InvoiceResponseDTO } from '@common/interfaces/gateway/invoice';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { InvoiceTcpResponse, CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { map } from 'rxjs';

@ApiTags('BFF for Invoice API')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<InvoiceResponseDTO> })
  @ApiOperation({ summary: 'Create a new invoice' })
  create(@Body() data: CreateInvoiceRequestDTO, @ProcessId() processId: string) {
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, {
        data,
        processId,
      })
      .pipe(map((invoice) => new ResponseDTO(invoice)));
  }
}
