import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { TypeOrmProvider } from '@shared/configurations/type-orm.config';
import { Product } from '@shared/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [TypeOrmProvider([Product]), TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
