import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mappers/user.mapper';
import { ERROR_CODE } from '@common/constants/enums/error-code.enum';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(payload: CreateUserTcpRequest) {
    const isExist = await this.userRepository.exists(payload.email);
    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    return this.userRepository.create(createUserRequestMapping(payload));
  }

  getAll() {
    return this.userRepository.getAll();
  }
}
