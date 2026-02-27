import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatuses } from '@shared/constants/enums/invoice.enum';
import { SagaContext } from '../saga/saga.interface';

class ClientRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

class ItemRequestDTO {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateInvoiceRequestDTO {
  @ApiProperty({ type: ClientRequestDTO })
  @IsObject()
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

export type CreateInvoiceTCP = CreateInvoiceRequestDTO;

export type SendInvoiceTCP = {
  invoiceId: string;
  userId: string;
};

export type UploadFileTCP = {
  fileBase64: string;
  fileName: string;
};

export type ChangeInvoiceStatusTCP = {
  invoiceId: string;
  status: InvoiceStatuses;
};

export interface InvoiceSendSagaContext extends SagaContext {
  invoiceId: string;
  userId: string;
  processId: string;

  // Step results
  fileBase64?: string;
  fileUrl?: string;
  publicId?: string;
  paymentLink?: string;
  sessionId?: string;
}
