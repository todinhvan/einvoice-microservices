import { MetadataKeys } from '@common/constants/common.constant';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthorizerResponse } from '@common/interfaces/tcp/authorizer';

export const UserData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userData = request[MetadataKeys.USER_DATA] as AuthorizerResponse;

  if (!userData) {
    throw new UnauthorizedException('User data not found');
  }

  return userData.metadata;
});
