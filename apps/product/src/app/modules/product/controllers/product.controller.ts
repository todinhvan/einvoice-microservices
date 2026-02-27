import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import { ProductService } from '../services/product.service';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { CreateProductTCP, UpdateProductTCP } from '@shared/contracts/product/product-request.type';
import { ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TcpMessages.PRODUCT.CREATE)
  async createProduct(@RequestParams('data') data: CreateProductTCP) {
    const product = await this.productService.createProduct(data);
    return ResponseTCP.success(product);
  }

  @MessagePattern(TcpMessages.PRODUCT.GET)
  async getProduct(@RequestParams('data') data: number) {
    const product = await this.productService.getProduct(data);
    return ResponseTCP.success(product);
  }

  @MessagePattern(TcpMessages.PRODUCT.GET_ALL)
  async getProducts() {
    const products = await this.productService.getProducts();
    return ResponseTCP.success(products);
  }

  @MessagePattern(TcpMessages.PRODUCT.GET_ALL_BY_IDS)
  async getProductsByIds(@RequestParams('data') data: number[]) {
    const products = await this.productService.getProductsByIds(data);
    return ResponseTCP.success(products);
  }

  @MessagePattern(TcpMessages.PRODUCT.UPDATE)
  async updateProduct(@RequestParams('data') data: UpdateProductTCP) {
    const product = await this.productService.updateProduct(data);
    return ResponseTCP.success(product);
  }

  @MessagePattern(TcpMessages.PRODUCT.DELETE)
  async deleteProduct(@RequestParams('data') data: number) {
    await this.productService.deleteProduct(data);
    return ResponseTCP.success(HttpMessages.DELETED);
  }
}
