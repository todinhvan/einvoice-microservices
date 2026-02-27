import { ApiProperty } from '@nestjs/swagger';

export class EntityResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
