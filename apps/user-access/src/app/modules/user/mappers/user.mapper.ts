import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { ObjectId } from 'mongodb';

export const createUserRequestMapping = (payload: CreateUserTcpRequest) => ({
  ...payload,
  roles: payload.roles.map((role) => new ObjectId(role)),
});
