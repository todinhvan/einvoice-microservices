import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { generateProcessId } from '@shared/utils/string.util';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const processId = request[MetadataKeys.PROCESS_ID] as string | undefined;
  return processId ? processId : generateProcessId();
});
