import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { ProductService } from '../services/product.service';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(@RequestParams() params: CreateProductTcpRequest): Promise<Response<ProductTcpResponse>> {
    const product = await this.productService.create(params);
    return Response.success<ProductTcpResponse>(product);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL)
  async getAll(): Promise<Response<ProductTcpResponse[]>> {
    const products = await this.productService.getAll();
    return Response.success<ProductTcpResponse[]>(products);
  }
}
