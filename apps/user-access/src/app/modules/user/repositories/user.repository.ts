import { TUserModel, User, UserModelName } from '@common/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModelName) private userModel: TUserModel) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  getAll() {
    return this.userModel.find().exec();
  }

  async exists(email: string) {
    const result = await this.userModel.exists({ email }).exec();
    return !!result;
  }
}
