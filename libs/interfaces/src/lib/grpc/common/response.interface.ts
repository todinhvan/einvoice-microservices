import { HttpMessage } from '@common/constants/enums/http-message.constant';
import { HttpStatus } from '@nestjs/common';

export class Response<T> {
  code: string;
  data: T;
  error?: string;
  statusCode?: number;

  constructor(data: Partial<Response<T>>) {
    this.code = data.code || HttpMessage.OK;
    this.statusCode = data.statusCode || HttpStatus.OK;
    this.error = data.error;
    this.data = data.data as T;
  }

  static success<T>(data: T) {
    return new Response<T>({ data, code: HttpMessage.OK, statusCode: HttpStatus.OK });
  }
}

export type ResponseType<T> = Response<T>;
