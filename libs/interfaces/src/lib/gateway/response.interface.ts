import { HttpStatus } from '@nestjs/common';
import { HttpMessage } from '@common/constants/enums/http-message.constant';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<T> {
  @ApiProperty({ type: 'string' })
  message = HttpMessage.OK;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  processId?: string;

  @ApiProperty()
  duration?: string;

  @ApiProperty({ type: 'number' })
  status = HttpStatus.OK;

  constructor(data: Partial<ResponseDTO<T>>) {
    Object.assign(this, data);
  }
}
