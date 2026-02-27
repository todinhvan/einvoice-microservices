import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDefinition } from '@shared/schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Role } from '@shared/schemas/role.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserDefinition.name) private readonly model: Model<User>) {}

  create(user: User) {
    return this.model.create(user);
  }

  findById(id: ObjectId) {
    return this.model.findById(id).populate<{ roles: Role[] }>('roles').exec();
  }

  findByKeycloakUserId(keycloakUserId: string) {
    return this.model.findOne({ keycloakUserId }).populate<{ roles: Role[] }>('roles').exec();
  }

  findAll() {
    return this.model.find().populate<{ roles: Role[] }>('roles').exec();
  }

  exists(email: string) {
    return this.model.exists({ email }).exec();
  }
}
