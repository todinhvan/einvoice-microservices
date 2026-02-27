import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { firstValueFrom, map } from 'rxjs';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { ProcessId } from '@shared/decorators/process-id.decorator';
import {
  CreateProductRequestDTO,
  CreateProductTCP,
  UpdateProductRequestDTO,
  UpdateProductTCP,
} from '@shared/contracts/product/product-request.type';
import { ProductResponse } from '@shared/contracts/product/product-response.type';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(@Inject(TcpServices.PRODUCT) private readonly productClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<ProductResponse> })
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(@Body() request: CreateProductRequestDTO, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.productClient
        .send<ProductResponse, CreateProductTCP>(TcpMessages.PRODUCT.CREATE, {
          processId,
          data: request,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseDTO<ProductResponse> })
  @ApiOperation({ summary: 'Get a product' })
  async getProduct(@Param('id') id: number, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.productClient
        .send<ProductResponse, number>(TcpMessages.PRODUCT.GET, {
          processId,
          data: id,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Get()
  @ApiOkResponse({ type: ResponseDTO<ProductResponse[]> })
  @ApiOperation({ summary: 'Get all products' })
  async getProducts(@ProcessId() processId: string) {
    return await firstValueFrom(
      this.productClient
        .send<ProductResponse[], null>(TcpMessages.PRODUCT.GET_ALL, {
          processId,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseDTO<ProductResponse> })
  @ApiOperation({ summary: 'Update a product' })
  async updateProduct(
    @Param('id') id: number,
    @Body() request: UpdateProductRequestDTO,
    @ProcessId() processId: string,
  ) {
    return await firstValueFrom(
      this.productClient
        .send<ProductResponse, UpdateProductTCP>(TcpMessages.PRODUCT.UPDATE, {
          processId,
          data: { id, ...request },
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseDTO<null> })
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Param('id') id: number, @ProcessId() processId: string) {
    return await firstValueFrom(
      this.productClient
        .send<string, number>(TcpMessages.PRODUCT.DELETE, {
          processId,
          data: id,
        })
        .pipe(map((response) => ResponseDTO.ok(response.data))),
    );
  }
}
