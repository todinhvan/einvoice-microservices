import { v4 } from 'uuid';
import { UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';

export const generateProcessId = (prefix?: string) => {
  return prefix ? `${prefix}-${v4()}` : v4();
};

export const parseToken = (accessToken: string) => {
  if (!accessToken.trim()) {
    throw new UnauthorizedException('Token is required');
  }

  if (accessToken.includes(' ')) {
    return accessToken.split(' ')[1];
  }

  return accessToken;
};

export const generateCacheKeyToken = (token: string) => {
  const hash = createHash('sha256').update(token).digest('hex');
  return `user-token:${hash}`;
};
