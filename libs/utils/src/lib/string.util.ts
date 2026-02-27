import { v4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { createHash } from 'crypto';

export const generateProcessId = (prefix?: string) => {
  return prefix ? `${prefix}-${v4()}` : v4();
};

export const generateCacheToken = (token: string) => {
  const hashToken = createHash('sha256').update(token).digest('hex');
  return `user-cache-token:${hashToken}`;
};

export const generateInvoiceFileName = (invoiceId: string) => `invoice-${invoiceId}`;

export const hashString = async (password: string, saltRounds: number) => {
  return await hash(password, saltRounds);
};

export const compareHash = async (password: string, hash: string) => {
  return await compare(password, hash);
};
