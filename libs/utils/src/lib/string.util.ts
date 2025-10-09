import { v4 } from 'uuid';

export const generateProcessId = (prefix?: string) => {
  return prefix ? `${prefix}-${v4()}` : v4();
};
