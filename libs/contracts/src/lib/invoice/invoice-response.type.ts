import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';
import { SchemaResponse } from '../common/schema-response.type';
import { ObjectId } from 'mongodb';

export class ClientResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}

export class ItemResponse {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  vatRate: number;

  @ApiProperty()
  total: number;
}

export class InvoiceResponse extends SchemaResponse {
  @ApiProperty({ type: ClientResponse })
  client: ClientResponse;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  vatAmount: number;

  @ApiProperty({ type: String, enum: InvoiceStatuses })
  status: InvoiceStatuses;

  @ApiProperty({ type: [ItemResponse] })
  items: ItemResponse[];

  @ApiPropertyOptional()
  supervisorId?: ObjectId;

  @ApiPropertyOptional()
  fileUrl?: string;
}
