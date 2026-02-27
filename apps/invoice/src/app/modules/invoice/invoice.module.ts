/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoProvider } from '@shared/configurations/mongo.config';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { InvoiceDefinition } from '@shared/schemas/invoice.schema';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';
import { KafkaModule } from '@shared/kafka/kafka.module';
import { QueueServices } from '@shared/constants/enums/queue.enum';
import { InvoiceSagaService } from './services/invoice-saga.service';
import { SagaOrchestrationModule } from '@shared/saga-orchestration/saga-orchestration.module';

@Module({
  imports: [
    MongoProvider,
    MongooseModule.forFeature([InvoiceDefinition]),
    KafkaModule.forRoot(QueueServices.INVOICE),
    SagaOrchestrationModule.forRoot(),
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    InvoiceRepository,
    InvoiceSagaService,
    TcpProvider(TcpServices.PRODUCT),
    TcpProvider(TcpServices.PDF_GENERATOR),
    TcpProvider(TcpServices.MEDIA),
    TcpProvider(TcpServices.PAYMENT),
  ],
})
export class InvoiceModule {}
