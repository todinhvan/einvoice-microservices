import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { toProduct, toProductResponse, updateProduct } from '../mappers/product.mapper';
import { CreateProductTCP, UpdateProductTCP } from '@shared/contracts/product/product-request.type';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(data: CreateProductTCP) {
    const exists = await this.productRepository.exists(data.name, data.sku);
    if (exists) {
      throw new ConflictException(ErrorMessages.PRODUCT_ALREADY_EXISTS);
    }

    let product = toProduct(data);
    product = await this.productRepository.save(product);
    return toProductResponse(product);
  }

  async getProduct(id: number) {
    const product = await this.existsProduct(id);
    return toProductResponse(product);
  }

  async getProducts() {
    const products = await this.productRepository.findAll();
    return products.map((product) => toProductResponse(product));
  }

  async getProductsByIds(ids: number[]) {
    const products = await this.productRepository.findAllByIds(ids);
    return products.map((product) => toProductResponse(product));
  }
  async updateProduct(data: UpdateProductTCP) {
    let product = await this.existsProduct(data.id);
    product = updateProduct(product, data);
    product = await this.productRepository.save(product);
    return toProductResponse(product);
  }

  async deleteProduct(id: number) {
    const product = await this.existsProduct(id);
    await this.productRepository.delete(product);
  }

  private async existsProduct(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    return product;
  }
}
