import { Test } from '@nestjs/testing';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@shared/entities/product.entity';
import { CreateProductTCP } from '@shared/contracts/product/product-request.type';
import { HttpStatus } from '@nestjs/common';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { toProductResponse } from './mappers/product.mapper';

describe('ProductIntegration', () => {
  let productController: ProductController;
  let productRepository: ProductRepository;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:16-alpine').start();

    const productModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: postgresContainer.getHost(),
          port: postgresContainer.getPort(),
          username: postgresContainer.getUsername(),
          password: postgresContainer.getPassword(),
          database: postgresContainer.getDatabase(),
          entities: [Product],
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      controllers: [ProductController],
      providers: [ProductService, ProductRepository],
    }).compile();

    productController = productModule.get<ProductController>(ProductController);
    productRepository = productModule.get<ProductRepository>(ProductRepository);
  }, 60000);

  afterAll(async () => {
    await postgresContainer.stop();
  });

  afterEach(async () => {
    const products = await productRepository.findAll();
    for (const product of products) {
      await productRepository.delete(product);
    }
  });

  it('shoud be defined', () => {
    expect(productController).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should create a product', async () => {
    const productDTO: CreateProductTCP = {
      name: 'Product 1',
      sku: 'SKU-1',
      description: 'Product 1 Description',
      unit: 'Unit',
      price: 100,
      vatRate: 10,
    };
    const result = await productController.createProduct(productDTO);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.message).toBe(HttpMessages.OK);
    expect(result.data).toBeDefined();
    expect(result.data).toEqual(
      toProductResponse({
        id: 1,
        ...productDTO,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      }),
    );

    const product = await productRepository.findById(result.data.id);
    expect(product).toBeDefined();
    expect(product.sku).toBe(productDTO.sku);
    expect(product.name).toBe(productDTO.name);
    expect(product.description).toBe(productDTO.description);
    expect(product.unit).toBe(productDTO.unit);
    expect(product.price).toBe(productDTO.price);
    expect(product.vatRate).toBe(productDTO.vatRate);
  });

  it('should get all producs', async () => {
    await productRepository.save({
      id: 2,
      name: 'Product 1',
      sku: 'SKU-1',
      description: 'Product 1 Description',
      unit: 'Unit',
      price: 100,
      vatRate: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await productRepository.save({
      id: 3,
      name: 'Product 2',
      sku: 'SKU-2',
      description: 'Product 2 Description',
      unit: 'Unit',
      price: 200,
      vatRate: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await productController.getProducts();
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.message).toBe(HttpMessages.OK);
    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(2);
    expect(result.data.find((p) => p.sku === 'SKU-1')).toBeDefined();
    expect(result.data.find((p) => p.sku === 'SKU-2')).toBeDefined();
  });
});
