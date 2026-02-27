import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import { AuthorizedMetadata } from '@shared/contracts/authorizer/authorizer-response.type';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';

export const getAccessToken = (request: Request, keepBearer = false) => {
  const authorization = request.headers.authorization;
  if (!authorization || authorization.split(' ').length !== 2) {
    throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
  }

  return keepBearer ? authorization : authorization.split(' ').pop();
};

export const setAuthorizedMetadata = (request: Request, data: AuthorizedMetadata) => {
  (request as any)[MetadataKeys.AUTHORIZED_DATA] = data;
};
