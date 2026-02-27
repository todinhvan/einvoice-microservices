import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { formatDateTime } from '@shared/utils/date-time.util';
import { RpcException } from '@nestjs/microservices';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { RequestTCP } from '@shared/contracts/tcp/tcp-client.interface';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const data: RequestTCP<unknown> = context.switchToRpc().getData();
    const handlerName = context.getHandler().name;
    const startTime = Date.now();
    const processId = data[MetadataKeys.PROCESS_ID];

    Logger.log(
      `TCP Request >>> Start process [${processId}] with [${handlerName}] at [${formatDateTime(startTime, 'vi-VN')}]. Input: ${JSON.stringify(data)}`,
    );

    return next.handle().pipe(
      tap(() =>
        Logger.log(
          `TCP Response <<< End process [${processId}] with [${handlerName}]. Duration '${Date.now() - startTime}ms`,
        ),
      ),
      catchError((error) => {
        Logger.error(
          `TCP Error <<< Error process [${processId}] with [${handlerName}]. Message: ${error.message}. Error: ${JSON.stringify(error)}. Duration: ${Date.now() - startTime}ms`,
        );
        throw new RpcException({
          code: error.status || error.code || error.error?.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error?.response?.message || error?.message || HttpMessages.INTERNAL_SERVER_ERROR,
        });
      }),
    );
  }
}
