import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { toRoleResponse } from '../mappers/role.mapper';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getAllRoles() {
    const roles = await this.roleRepository.findAll();
    return roles.map((role) => toRoleResponse(role));
  }
}
