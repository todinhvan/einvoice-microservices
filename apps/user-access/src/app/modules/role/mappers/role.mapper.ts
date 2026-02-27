import { Role } from '@shared/schemas/role.schema';
import { RoleResponse } from '@shared/contracts/user-access/role/role-response.type';

export const toRoleResponse = (role: Role): RoleResponse => {
  const response = new RoleResponse();
  response.id = role.id;
  response.name = role.name;
  response.description = role.description;
  response.permissions = role.permissions;
  response.createdAt = role.createdAt;
  response.updatedAt = role.updatedAt;
  return response;
};
