import { HttpStatus } from '@nestjs/common';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';

export class ResponseGRPC<T> {
  status: number;
  message: string;
  data?: T;
  error?: string;

  constructor(data?: Partial<ResponseGRPC<T>>) {
    this.status = data?.status || HttpStatus.OK;
    this.message = data?.message || HttpMessages.OK;
    this.data = data?.data;
    this.error = data?.error;
  }

  static success<T>(data: T) {
    return new ResponseGRPC<T>({ data });
  }
}
