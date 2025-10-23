import { UnauthorizedException } from '@nestjs/common';
import { parseToken } from './string.util';
import { Request } from 'express';
import { AuthorizerResponse } from '@common/interfaces/tcp/authorizer';
import { MetadataKeys } from '@common/constants/common.constant';

export const getAccessToken = (request: Request, keepBearer = false) => {
  const accessToken = request.headers?.['authorization'];

  if (!accessToken) {
    throw new UnauthorizedException('Token is required');
  }

  return keepBearer ? accessToken : parseToken(accessToken);
};

export const setUserData = (request: any, authorizerResponse: AuthorizerResponse) => {
  request[MetadataKeys.USER_DATA] = authorizerResponse;
};
