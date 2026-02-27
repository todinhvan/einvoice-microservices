import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTCP } from '@shared/contracts/product/product-request.type';
import { ConflictException } from '@nestjs/common';
import { Product } from '@shared/entities/product.entity';
import { toProductResponse } from '../mappers/product.mapper';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  const mockProductRepository = {
    save: jest.fn(),
    exists: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductService, { provide: ProductRepository, useValue: mockProductRepository }],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('createProduct', () => {
    const productDTO: CreateProductTCP = {
      name: 'Product 1',
      sku: 'SKU-1',
      description: 'Product 1 Description',
      unit: 'Unit',
      price: 100,
      vatRate: 10,
    };

    it('should create a product', async () => {
      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.save.mockResolvedValue({
        id: 1,
        ...productDTO,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await productService.createProduct(productDTO);

      expect(mockProductRepository.exists).toHaveBeenCalledWith(productDTO.name, productDTO.sku);
      expect(mockProductRepository.save).toHaveBeenCalledWith(productDTO);
      expect(result).toEqual(
        toProductResponse({
          id: 1,
          ...productDTO,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should failed for create product with product exists', async () => {
      mockProductRepository.exists.mockResolvedValue(true);
      await expect(productService.createProduct(productDTO)).rejects.toThrow(ConflictException);

      expect(mockProductRepository.exists).toHaveBeenCalledWith(productDTO.name, productDTO.sku);
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getProducts', () => {
    const products: Product[] = [
      {
        id: 1,
        name: 'Product 1',
        sku: 'SKU-1',
        description: 'Product 1 Description',
        unit: 'Unit',
        price: 100,
        vatRate: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Product 2',
        sku: 'SKU-2',
        description: 'Product 2 Description',
        unit: 'Unit',
        price: 200,
        vatRate: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should get all products', async () => {
      mockProductRepository.findAll.mockResolvedValue(products);

      const result = await productService.getProducts();

      expect(mockProductRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(products.map((product) => toProductResponse(product)));
    });
  });
});
