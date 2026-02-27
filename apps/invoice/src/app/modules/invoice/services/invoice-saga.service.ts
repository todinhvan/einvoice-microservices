import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { Invoice } from '@shared/schemas/invoice.schema';
import { SagaStep } from '@shared/contracts/saga/saga.interface';
import { InvoiceSendSagaContext, UploadFileTCP } from '@shared/contracts/invoice/invoice-request.type';
import { firstValueFrom, map } from 'rxjs';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import { generateInvoiceFileName } from '@shared/utils/string.util';
import { PaymentResponse } from '@shared/contracts/payment/payment-response.type';
import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';
import { ObjectId } from 'mongodb';
import { UploadFileResponse } from '@shared/contracts/media/media-response.type';

@Injectable()
export class InvoiceSagaService {
  private readonly logger = new Logger(InvoiceSagaService.name);

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TcpServices.PDF_GENERATOR) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TcpServices.MEDIA) private readonly mediaClient: TcpClient,
    @Inject(TcpServices.PAYMENT) private readonly paymentClient: TcpClient,
  ) {}

  getInvoiceSendSteps(invoice: Invoice): SagaStep<InvoiceSendSagaContext>[] {
    return [
      {
        name: 'GENERATE_PDF',
        execute: async (context: InvoiceSendSagaContext) => {
          try {
            this.logger.log(`Generating PDF for invoice ${context.invoiceId}`);

            const fileBase64 = await firstValueFrom(
              this.pdfGeneratorClient
                .send<string, Invoice>(TcpMessages.PDF_GENERATOR.CREATE_INVOICE_PDF, {
                  processId: context.processId,
                  data: invoice,
                })
                .pipe(map((response) => response.data)),
            );
            return {
              success: true,
              data: {
                fileBase64,
              },
            };
          } catch (error) {
            this.logger.error(`Failed to generate PDF: ${error.message}`);
            return {
              success: false,
              error: error.message,
            };
          }
        },
      },
      {
        name: 'UPLOAD_FILE',
        execute: async (context: InvoiceSendSagaContext) => {
          try {
            this.logger.log(`Uploading file for invoice ${context.invoiceId}`);
            if (!context.fileBase64) {
              throw new NotFoundException(ErrorMessages.PDF_FILE_NOT_FOUND);
            }

            const { fileUrl, publicId } = await firstValueFrom(
              this.mediaClient
                .send<UploadFileResponse, UploadFileTCP>(TcpMessages.MEDIA.UPLOAD_FILE, {
                  processId: context.processId,
                  data: {
                    fileBase64: context.fileBase64,
                    fileName: generateInvoiceFileName(context.invoiceId),
                  },
                })
                .pipe(map((response) => response.data)),
            );
            return {
              success: true,
              data: {
                fileUrl,
                publicId,
              },
            };
          } catch (error) {
            this.logger.error(`Failed to upload file: ${error.message}`);
            return {
              success: false,
              error: error.message,
            };
          }
        },
        compensate: async (context: InvoiceSendSagaContext) => {
          try {
            if (context.fileUrl && context.publicId) {
              this.logger.log(`Compensating file upload for invoice ${context.invoiceId}`);
              await firstValueFrom(
                this.mediaClient
                  .send<string, string>(TcpMessages.MEDIA.DESTROY_FILE, {
                    processId: context.processId,
                    data: context.publicId,
                  })
                  .pipe(map((response) => response.data)),
              );
              this.logger.warn(`File deletion implemented. File URL: ${context.fileUrl}`);
            }
          } catch (error) {
            this.logger.error(`Failed to compensate file upload: ${error.message}`);
          }
        },
      },
      {
        name: 'CREATE_PAYMENT',
        execute: async (context: InvoiceSendSagaContext) => {
          try {
            this.logger.log(`Creating payment session for invoice ${context.invoiceId}`);
            const { paymentLink, sessionId } = await firstValueFrom(
              this.paymentClient
                .send<
                  PaymentResponse,
                  Invoice
                >(TcpMessages.PAYMENT.STRIPE, { processId: context.processId, data: invoice })
                .pipe(map((response) => response.data)),
            );
            return {
              success: true,
              data: {
                paymentLink,
                sessionId,
              },
            };
          } catch (error) {
            this.logger.error(`Failed to create payment: ${error.message}`);
            return {
              success: false,
              error: error.message,
            };
          }
        },
        compensate: async (context: InvoiceSendSagaContext) => {
          try {
            if (context.paymentLink && context.sessionId) {
              this.logger.log(`Compensating payment creation for invoice ${context.invoiceId}`);
              await firstValueFrom(
                this.paymentClient
                  .send<string, string>(TcpMessages.PAYMENT.STRIPE_EXPIRE, {
                    processId: context.processId,
                    data: context.sessionId,
                  })
                  .pipe(map((response) => response.data)),
              );
              this.logger.warn(`Payment cancellation implemented. Payment link: ${context.paymentLink}`);
            }
          } catch (error) {
            this.logger.error(`Failed to compensate payment creation: ${error.message}`);
          }
        },
      },
      {
        name: 'UPDATE_INVOICE',
        execute: async (context: InvoiceSendSagaContext) => {
          try {
            this.logger.log(`Updating invoice ${context.invoiceId} status to SENT`);
            await this.invoiceRepository.updateById(new ObjectId(context.invoiceId), {
              status: InvoiceStatuses.SENT,
              fileUrl: context.fileUrl,
              supervisorId: new ObjectId(context.userId),
            });
            return {
              success: true,
            };
          } catch (error) {
            this.logger.error(`Failed to update invoice: ${error.message}`);
            return {
              success: false,
              error: error.message,
            };
          }
        },
        compensate: async (context: InvoiceSendSagaContext) => {
          try {
            this.logger.log(`Compensating invoice update for invoice ${context.invoiceId}`);
            await this.invoiceRepository.updateById(new ObjectId(context.invoiceId), {
              status: InvoiceStatuses.CREATED,
              fileUrl: null,
              supervisorId: null,
            });
            this.logger.warn(`Invoice ${context.invoiceId} status reverted to CREATED`);
          } catch (error) {
            this.logger.error(`Failed to compensate invoice update: ${error.message}`);
          }
        },
      },
      // {
      //   name: 'DEMO_SAGA',
      //   execute: async (context: InvoiceSendSagaContext) => {
      //     throw new BadRequestException('Demo saga failure');
      //   },
      // },
    ];
  }
}
