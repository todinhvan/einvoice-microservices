import { v4 } from 'uuid';
import { UnauthorizedException } from '@nestjs/common';

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
