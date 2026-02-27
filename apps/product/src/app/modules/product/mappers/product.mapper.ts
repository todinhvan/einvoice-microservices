import { CreateProductTCP, UpdateProductTCP } from '@shared/contracts/product/product-request.type';
import { ProductResponse } from '@shared/contracts/product/product-response.type';
import { Product } from '@shared/entities/product.entity';

export const toProduct = (data: CreateProductTCP): Product => {
  const product = new Product();
  product.name = data.name;
  product.description = data.description || '';
  product.sku = data.sku;
  product.unit = data.unit;
  product.price = data.price;
  product.vatRate = data.vatRate;
  return product;
};

export const updateProduct = (product: Product, data: UpdateProductTCP): Product => {
  product.name = data.name;
  product.description = data.description || '';
  product.unit = data.unit;
  product.price = data.price;
  product.vatRate = data.vatRate;
  return product;
};

export const toProductResponse = (product: Product): ProductResponse => {
  const response = new ProductResponse();
  response.id = product.id;
  response.name = product.name;
  response.description = product.description;
  response.sku = product.sku;
  response.unit = product.unit;
  response.price = product.price;
  response.vatRate = product.vatRate;
  response.createdAt = product.createdAt;
  response.updatedAt = product.updatedAt;
  return response;
};
