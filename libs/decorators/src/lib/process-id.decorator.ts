import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MetadataKeys } from '@common/constants/common.constant';
import { generateProcessId } from '@common/utils/string.util';

export const ProcessId = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest();
  const processId = request[MetadataKeys.PROCESS_ID];

  return processId || generateProcessId();
});
