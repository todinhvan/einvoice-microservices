import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDTO } from '../common/base-response.dto';
import { INVOICE_STATUS } from '@common/constants/enums/invoice.enum';

export class ClientResponseDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}

export class ItemResponseDTO {
  @ApiProperty()
  productId: string;

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

export class InvoiceResponseDTO extends BaseResponseDTO {
  @ApiProperty({ type: ClientResponseDTO })
  client: ClientResponseDTO;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  vatAmount: number;

  @ApiProperty({ type: String, enum: INVOICE_STATUS })
  status: INVOICE_STATUS;

  @ApiProperty({ type: [ItemResponseDTO] })
  items: ItemResponseDTO[];

  @ApiPropertyOptional()
  supervisorId?: string;

  @ApiPropertyOptional()
  fileUrl?: string;
}
