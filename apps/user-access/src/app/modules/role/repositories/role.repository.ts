import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDefinition } from '@shared/schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(RoleDefinition.name) private readonly model: Model<Role>) {}

  findAll() {
    return this.model.find().exec();
  }
}
