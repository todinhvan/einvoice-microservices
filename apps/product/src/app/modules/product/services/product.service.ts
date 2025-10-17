import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(payload: CreateProductTcpRequest) {
    const { sku, name } = payload;
    const product = await this.productRepository.exists(sku, name);
    if (product) {
      throw new BadRequestException('Product already exists');
    }
    return this.productRepository.create(payload);
  }

  getAll() {
    return this.productRepository.findAll();
  }
}
