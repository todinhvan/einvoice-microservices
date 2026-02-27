import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@shared/entities/product.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly repository: Repository<Product>) {}

  save(product: Product) {
    return this.repository.save(product);
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  findAll() {
    return this.repository.find();
  }

  findAllByIds(ids: number[]) {
    return this.repository.findBy({ id: In(ids) });
  }

  delete(product: Product) {
    return this.repository.remove(product);
  }

  exists(name: string, sku: string) {
    return this.repository.exists({ where: { name, sku } });
  }
}
