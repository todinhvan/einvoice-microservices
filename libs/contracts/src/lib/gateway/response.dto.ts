import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';

export class ResponseDTO<T> {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  processId?: string;

  @ApiProperty()
  duration?: string;

  constructor(data?: Partial<ResponseDTO<T>>) {
    this.status = data?.status || HttpStatus.OK;
    this.message = data?.message || HttpMessages.OK;
    this.data = data?.data;
    this.processId = data?.processId;
    this.duration = data?.duration;
  }

  static ok<T>(data: T) {
    return new ResponseDTO<T>({ data });
  }
}
