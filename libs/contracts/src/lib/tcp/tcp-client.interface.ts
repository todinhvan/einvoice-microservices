import { HttpStatus } from '@nestjs/common';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { Observable } from 'rxjs';

export class RequestTCP<T> {
  processId: string;
  data?: T;
}

export class ResponseTCP<T> {
  status: number;
  message: string;
  data?: T;
  error?: string;

  constructor(data?: Partial<ResponseTCP<T>>) {
    this.status = data?.status || HttpStatus.OK;
    this.message = data?.message || HttpMessages.OK;
    this.data = data?.data;
    this.error = data?.error;
  }

  static success<T>(data: T) {
    return new ResponseTCP<T>({ data });
  }
}

export interface TcpClient {
  send<TResult = any, TInput = any>(pattern: any, data: RequestTCP<TInput>): Observable<ResponseTCP<TResult>>;
  emit<TResult = any, TInput = any>(pattern: any, data: RequestTCP<TInput>): Observable<ResponseTCP<TResult>>;
}
