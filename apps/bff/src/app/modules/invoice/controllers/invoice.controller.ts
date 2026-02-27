import { Body, Controller, Get, Inject, Logger, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { InvoiceResponse } from '@shared/contracts/invoice/invoice-response.type';
import {
  CreateInvoiceRequestDTO,
  CreateInvoiceTCP,
  SendInvoiceTCP,
} from '@shared/contracts/invoice/invoice-request.type';
import {} from '@shared/contracts/invoice/invoice-response.type';
import { ProcessId } from '@shared/decorators/process-id.decorator';
import { firstValueFrom, map } from 'rxjs';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { Authorization } from '@shared/decorators/authorization.decorator';
import { AuthData } from '@shared/decorators/auth-data.decorator';
import { AuthorizedMetadata } from '@shared/contracts/authorizer/authorizer-response.type';
import { Permissions } from '@shared/decorators/permission.decorator';
import { PERMISSION } from '@shared/constants/enums/permission.enum';

@Controller('invoices')
@ApiTags('Invoice')
export class InvoiceController {
  constructor(@Inject(TcpServices.INVOICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<InvoiceResponse> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE])
  async createInvoice(@Body() request: CreateInvoiceRequestDTO, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.invoiceClient
        .send<InvoiceResponse, CreateInvoiceTCP>(TcpMessages.INVOICE.CREATE, {
          processId,
          data: request,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Post(':id/send')
  @ApiOkResponse({ type: ResponseDTO<string> })
  @ApiOperation({ summary: 'Send a invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE, PERMISSION.INVOICE_SEND])
  async sendInvoice(@Param('id') id: string, @ProcessId() processId: string, @AuthData('userId') userId: string) {
    return await firstValueFrom(
      this.invoiceClient
        .send<string, SendInvoiceTCP>(TcpMessages.INVOICE.SEND, {
          processId,
          data: {
            invoiceId: id,
            userId,
          },
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseDTO<InvoiceResponse> })
  @ApiOperation({ summary: 'Get a invoice' })
  async getInvoice(@Param('id') id: string, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.invoiceClient
        .send<InvoiceResponse, string>(TcpMessages.INVOICE.GET, {
          processId,
          data: id,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }
  @Get()
  @ApiOkResponse({ type: ResponseDTO<InvoiceResponse[]> })
  @ApiOperation({ summary: 'Get all invoices' })
  async getInvoices(@ProcessId() processId: string) {
    return await firstValueFrom(
      this.invoiceClient
        .send<InvoiceResponse[], null>(TcpMessages.INVOICE.GET_ALL, {
          processId,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Put('test')
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE, PERMISSION.INVOICE_SEND])
  test(@AuthData() data: AuthorizedMetadata) {
    Logger.log(data);
    return ResponseDTO.ok('Test');
  }
}
