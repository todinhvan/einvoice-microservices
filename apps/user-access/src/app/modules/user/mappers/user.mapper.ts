import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { ObjectId } from 'mongodb';

export const createUserRequestMapping = (payload: CreateUserTcpRequest, userId: string) => ({
  ...payload,
  userId,
  roles: payload.roles.map((role) => new ObjectId(role)),
});
