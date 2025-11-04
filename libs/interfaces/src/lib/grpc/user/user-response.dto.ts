import { User } from '@common/schemas/user.schema';

export type GetUserInfoGrpcResponse = {
  code: string;
  data: User;
  error?: string;
};
