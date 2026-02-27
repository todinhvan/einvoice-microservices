import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { Request } from 'express';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } = context
      .switchToHttp()
      .getRequest();
    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];
    const { originalUrl, method } = request;

    return next.handle().pipe(
      map((data: ResponseDTO<unknown>) => {
        if (data instanceof ResponseDTO) {
          data.processId = processId;
          data.duration = `${Date.now() - startTime}ms`;
        }
        return data;
      }),
      catchError((error) => {
        const message = error?.response?.message || error?.message || error || HttpMessages.INTERNAL_SERVER_ERROR;
        const statusCode =
          error?.code || error?.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        Logger.error(
          `HTTP Error <<< Error process [${processId}] with [${originalUrl} | ${method}]. Message: ${error.message}. Error: ${JSON.stringify(error)}. Duration: ${Date.now() - startTime}ms`,
        );

        const response = error.getResponse ? error.getResponse() : error.response;
        const data = response ? { ...response } : null;

        if (data && typeof data === 'object') {
          delete data.message;
          delete data.statusCode;
        }

        throw new HttpException(
          new ResponseDTO({
            data,
            duration: `${Date.now() - startTime}ms`,
            message,
            processId,
            status: statusCode,
          }),
          statusCode,
        );
      }),
    );
  }
}
