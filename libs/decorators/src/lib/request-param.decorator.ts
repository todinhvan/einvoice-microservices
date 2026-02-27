import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestTCP } from '@shared/contracts/tcp/tcp-client.interface';

export const RequestParams = createParamDecorator((key: keyof RequestTCP<unknown>, ctx: ExecutionContext) => {
  const data = ctx.switchToRpc().getData();
  return key ? data.data[key] : data.data;
});
