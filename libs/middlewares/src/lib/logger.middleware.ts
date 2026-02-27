import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { generateProcessId } from '@shared/utils/string.util';
import { formatDateTime } from '@shared/utils/date-time.util';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const processId = generateProcessId();
    const { originalUrl, method, body } = req;

    (req as any)[MetadataKeys.PROCESS_ID] = processId;
    (req as any)[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP Request >>> Start process [${processId}] with [${originalUrl} | ${method}] at [${formatDateTime(startTime, 'vi-VN')}]. Input: ${body === undefined ? 'empty' : JSON.stringify(body)}`,
    );

    const originRes = res.send.bind(res);
    res.send = (body: any) => {
      const endTime = Date.now();
      Logger.log(
        `HTTP Response <<< End process [${processId}] with [${originalUrl} | ${method}]. Duration: ${endTime - startTime}ms`,
      );
      return originRes(body);
    };

    next();
  }
}
