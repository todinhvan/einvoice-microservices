import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enums/invoice.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { firstValueFrom, map } from 'rxjs';
import { ObjectId } from 'mongodb';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
  ) {}

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

    await this.invoiceRepository.updateById(params.invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(params.userId),
      fileUrl,
    });

    return fileUrl;
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
