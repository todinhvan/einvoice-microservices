import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { generateProcessId } from '@common/utils/string.util';
import { MetadataKeys } from '@common/constants/common.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;

    const processId = generateProcessId();
    (req as any)[MetadataKeys.PROCESS_ID] = processId;
    (req as any)[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP >> Start process '${processId}' >> path '${originalUrl}' >> method '${method}' at '${startTime}' >> input: ${JSON.stringify(
        body,
      )}`,
    );

    const originalRes = res.send.bind(res);
    res.send = (body: any) => {
      const duration = Date.now() - startTime;
      Logger.log(`HTTP >> End process '${processId}' >> path '${originalUrl}' >> method '${method}' at '${duration}'`);

      return originalRes(body);
    };
    next();
  }
}
