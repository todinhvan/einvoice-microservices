import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class ItemRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  vatRate: number;

  @ApiProperty()
  @IsNumber()
  total: number;
}

export class CreateInvoiceRequestDTO {
  @ApiProperty({ type: ClientRequestDTO })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientRequestDTO)
  client: ClientRequestDTO;

  @ApiProperty({ type: [ItemRequestDTO] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemRequestDTO)
  items: ItemRequestDTO[];
}
