import { Product } from '@common/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly repository: Repository<Product>) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repository.create(data);
    return this.repository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    return this.repository.save({ ...data, id });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(sku: string, name: string): Promise<boolean> {
    return this.repository
      .findOne({
        where: [{ sku }, { name }],
      })
      .then((product) => !!product);
  }
}
