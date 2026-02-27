import { Module } from '@nestjs/common';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  controllers: [InvoiceController],
  providers: [TcpProvider(TcpServices.INVOICE)],
})
export class InvoiceModule {}
