import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestParams = createParamDecorator((param: string, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest();
  if (!param) {
    return request.data;
  }

  return request.data[param];
});
