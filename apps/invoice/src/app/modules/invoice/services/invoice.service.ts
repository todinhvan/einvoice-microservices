import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import {
  ChangeInvoiceStatusTcpRequest,
  CreateInvoiceTcpRequest,
  SendInvoiceTcpRequest,
} from '@common/interfaces/tcp/invoice';
import { createCheckoutInvoiceMapping, invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enums/invoice.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { firstValueFrom, map } from 'rxjs';
import { ObjectId } from 'mongodb';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { PaymentService } from '../../payment/services/payment.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { InvoiceSendPayload } from '@common/interfaces/queue/invoice';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
    private readonly paymentService: PaymentService,
    private readonly mailKafkaClient: KafkaService,
  ) {}

  async getById(id: string) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  create(payload: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(payload);
    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTcpRequest, processId: string) {
    const invoice = await this.invoiceRepository.findById(params.invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException('Cannot send invoice in its current status');
    }

    const pdfBase64 = await this.generateInvoicePdf(invoice, processId);
    const fileUrl = await this.uploadFileToStorage(
      { fileBase64: pdfBase64, fileName: `invoice_${invoice.id}` },
      processId,
    );

    const result = await this.paymentService.createCheckoutSession(createCheckoutInvoiceMapping(invoice));

    await this.invoiceRepository.updateById(params.invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(params.userId),
      fileUrl,
    });

    this.mailKafkaClient.emit<InvoiceSendPayload>('invoice-sent', {
      invoiceId: invoice.id,
      paymentLink: result.url,
    });
  }

  async changeStatus(params: ChangeInvoiceStatusTcpRequest) {
    return await this.invoiceRepository.changeStatus(params.invoiceId, params.status);
  }

  private generateInvoicePdf(invoice: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.GENERATE_INVOICE_PDF, {
          data: invoice,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }

  private uploadFileToStorage(data: UploadFileTcpRequest, processId: string) {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTcpRequest>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
          data,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
