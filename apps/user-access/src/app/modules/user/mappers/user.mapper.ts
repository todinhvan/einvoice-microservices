import { User } from '@shared/schemas/user.schema';
import { CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { ObjectId } from 'mongodb';
import { UserResponse } from '@shared/contracts/user-access/user/user-response.type';
import { RoleResponse } from '@shared/contracts/user-access/role/role-response.type';
import { UserPopulated } from '@shared/schemas/user.schema';

export const toUser = (data: CreateUserTCP): User => {
  const user = new User();
  user.firstName = data.firstName;
  user.lastName = data.lastName;
  user.email = data.email;
  user.password = data.password;
  user.roles = data.roleIds.map((role) => new ObjectId(role));
  return user;
};

export const toUserResponse = (user: UserPopulated): UserResponse => {
  const rolesResponse = user.roles.map((role) => {
    const roleResponse = new RoleResponse();
    roleResponse.id = role.id;
    roleResponse.name = role.name;
    roleResponse.description = role.description;
    roleResponse.permissions = role.permissions;
    roleResponse.createdAt = role.createdAt;
    roleResponse.updatedAt = role.updatedAt;
    return roleResponse;
  });

  const response = new UserResponse();
  response.id = user.id;
  response.firstName = user.firstName;
  response.lastName = user.lastName;
  response.email = user.email;
  response.keycloakUserId = user.keycloakUserId;
  response.roles = rolesResponse;
  response.createdAt = user.createdAt;
  response.updatedAt = user.updatedAt;
  return response;
};
