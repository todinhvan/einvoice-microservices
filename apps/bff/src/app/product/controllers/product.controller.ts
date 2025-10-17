import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductRequestDTO, ProductResponseDTO } from '@common/interfaces/gateway/product';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { ProcessId } from '@common/decorators/process-id.decorator';
import { map } from 'rxjs';

@ApiTags('BFF for Product API')
@Controller('products')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<ProductResponseDTO> })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() data: CreateProductRequestDTO, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse, CreateProductTcpRequest>(TCP_REQUEST_MESSAGE.PRODUCT.CREATE, {
        data,
        processId,
      })
      .pipe(map((product) => new ResponseDTO(product)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDTO<ProductResponseDTO[]> })
  @ApiOperation({ summary: 'Get all products' })
  getAll(@ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse[]>(TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL, {
        processId,
      })
      .pipe(map((products) => new ResponseDTO(products)));
  }
}
