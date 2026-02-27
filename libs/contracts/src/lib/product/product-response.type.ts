import { ApiProperty } from '@nestjs/swagger';
import { EntityResponse } from '../common/entity-response.type';

export class ProductResponse extends EntityResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vatRate: number;
}
