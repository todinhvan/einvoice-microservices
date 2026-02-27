/* eslint-disable @nx/enforce-module-boundaries */
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import {
  ChangeInvoiceStatusTCP,
  CreateInvoiceTCP,
  InvoiceSendSagaContext,
  SendInvoiceTCP,
  UploadFileTCP,
} from '@shared/contracts/invoice/invoice-request.type';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { ProductResponse } from '@shared/contracts/product/product-response.type';
import { Invoice, Item } from '@shared/schemas/invoice.schema';
import { toInvoice, toInvoiceResponse, toItem } from '../mappers/invoice.mapper';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import { ObjectId } from 'mongodb';
import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';
import { KafkaService } from '@shared/kafka/kafka.service';
import { QueueEvents } from '@shared/constants/enums/queue.enum';
import { InvoiceSagaService } from './invoice-saga.service';
import { SagaOrchestrationService } from '@shared/saga-orchestration/saga-orchestration.service';
import { SagaType } from '@shared/constants/enums/saga.enum';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TcpServices.PRODUCT) private readonly productClient: TcpClient,
    @Inject(TcpServices.PDF_GENERATOR) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TcpServices.MEDIA) private readonly mediaClient: TcpClient,
    @Inject(TcpServices.PAYMENT) private readonly paymentClient: TcpClient,
    private readonly kafkaProducer: KafkaService,
    private readonly invoiceSagaService: InvoiceSagaService,
    private readonly sagaOrchestrationService: SagaOrchestrationService,
  ) {}

  async createInvoice(data: CreateInvoiceTCP, processId: string) {
    const items = await this.fetchProducts(data, processId);
    if (items.length === 0) {
      throw new BadRequestException(ErrorMessages.INVOICE_INVALID);
    }

    let invoice = toInvoice(data, items);
    invoice = await this.invoiceRepository.create(invoice);
    return toInvoiceResponse(invoice);
  }

  async sendInvoice(data: SendInvoiceTCP, processId: string, userId: string) {
    const invoice = await this.invoiceRepository.findById(new ObjectId(data.invoiceId));
    if (!invoice) {
      throw new NotFoundException(ErrorMessages.INVOICE_NOT_FOUND);
    }
    if (invoice.status !== InvoiceStatuses.CREATED) {
      throw new BadRequestException(ErrorMessages.INVOICE_CAN_NOT_BE_SENT);
    }

    const steps = this.invoiceSagaService.getInvoiceSendSteps(invoice);
    const invoiceSendSagaContext: InvoiceSendSagaContext = {
      sagaId: '',
      invoiceId: invoice.id,
      userId,
      processId,
    };

    try {
      await this.sagaOrchestrationService.execute({
        sagaType: SagaType.INVOICE_SEND,
        context: invoiceSendSagaContext,
        steps,
      });

      this.kafkaProducer.emit(QueueEvents.INVOICE.SENT, { invoice, paymentLink: invoiceSendSagaContext.paymentLink });
      return invoiceSendSagaContext.paymentLink;
    } catch (error) {
      Logger.error(`Failed to send invoice ${invoice.id}: ${error.message}`);
      throw error;
    }
  }

  async changeStatus(data: ChangeInvoiceStatusTCP) {
    const invoice = await this.invoiceRepository.findById(new ObjectId(data.invoiceId));
    if (!invoice) {
      throw new NotFoundException(ErrorMessages.INVOICE_NOT_FOUND);
    }
    if (invoice.status !== InvoiceStatuses.SENT) {
      throw new BadRequestException(ErrorMessages.INVOICE_CAN_NOT_BE_CHANGED);
    }

    await this.invoiceRepository.updateById(new ObjectId(invoice.id), { status: data.status });
  }

  async getInvoice(id: string) {
    const invoice = await this.invoiceRepository.findById(new ObjectId(id));
    if (!invoice) {
      throw new NotFoundException(ErrorMessages.INVOICE_NOT_FOUND);
    }
    return toInvoiceResponse(invoice);
  }

  async getInvoices() {
    const invoices = await this.invoiceRepository.findAll();
    return invoices.map((invoice) => toInvoiceResponse(invoice));
  }

  private async fetchProducts(data: CreateInvoiceTCP, processId: string): Promise<Item[]> {
    const productIds = data.items.map((item) => item.productId);
    const products = await firstValueFrom(
      this.productClient
        .send<ProductResponse[], number[]>(TcpMessages.PRODUCT.GET_ALL_BY_IDS, {
          processId,
          data: productIds,
        })
        .pipe(map((response) => response.data)),
    );

    const result = products.map((product) => {
      const item = data.items.find((item) => item.productId === product.id);
      if (item) {
        return {
          ...product,
          quantity: item.quantity,
        };
      }
    });

    return result.map((item) => toItem(item));
  }

  private async uploadFile(fileBase64: string, fileName: string, processId: string) {
    return await firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTCP>(TcpMessages.MEDIA.UPLOAD_FILE, { processId, data: { fileBase64, fileName } })
        .pipe(map((response) => response.data)),
    );
  }

  private async createCheckoutSession(invoice: Invoice, processId: string) {
    try {
      return await firstValueFrom(
        this.paymentClient
          .send<string, Invoice>(TcpMessages.PAYMENT.STRIPE, { processId, data: invoice })
          .pipe(map((response) => response.data)),
      );
    } catch (error) {
      Logger.log(error);
      throw new BadRequestException(error);
    }
  }
}
