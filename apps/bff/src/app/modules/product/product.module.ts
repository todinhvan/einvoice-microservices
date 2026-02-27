import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { TcpProvider } from '@shared/configurations/tcp.config';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';

@Module({
  controllers: [ProductController],
  providers: [TcpProvider(TcpServices.PRODUCT)],
})
export class ProductModule {}
