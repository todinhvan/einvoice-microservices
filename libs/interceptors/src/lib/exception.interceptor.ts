import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { Request } from 'express';
import { MetadataKeys } from '@common/constants/common.constant';
import { HttpMessage } from '@common/constants/enums/http-message.constant';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } =
      http.getRequest();

    const processId = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];
    return next.handle().pipe(
      map((data: ResponseDTO<unknown> | undefined) => {
        const duration = Date.now() - startTime;

        // Nếu không có data, tạo mới một ResponseDTO rỗng
        if (!data) {
          return new ResponseDTO({
            data: null,
            duration: `${duration} ms`,
            message: HttpMessage.OK,
            processId,
            status: HttpStatus.OK,
          });
        }

        // Nếu có data thì chỉ bổ sung thông tin
        data.duration = `${duration} ms`;
        data.processId = processId;
        return data;
      }),
      catchError((error) => {
        this.logger.error(error);
        const duration = Date.now() - startTime;
        const message = error?.response?.message || error?.message || error || HttpMessage.INTERNAL_SERVER_ERROR;
        const code =
          error?.code || error?.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException(
          new ResponseDTO({
            data: null,
            duration: `${duration} ms`,
            message,
            processId,
            status: code,
          }),
          code,
        );
      }),
    );
  }
}
