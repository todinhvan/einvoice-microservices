import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { AuthorizedMetadata } from '@shared/contracts/authorizer/authorizer-response.type';

export const AuthData = createParamDecorator((key: keyof AuthorizedMetadata, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const data = request[MetadataKeys.AUTHORIZED_DATA] as AuthorizedMetadata | undefined;

  return key ? (data ? data[key] : data) : data;
});
