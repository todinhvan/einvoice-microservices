import { ApiProperty } from '@nestjs/swagger';

export class SchemaResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
