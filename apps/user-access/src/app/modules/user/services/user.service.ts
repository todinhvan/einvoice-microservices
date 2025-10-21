import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mappers/user.mapper';
import { ERROR_CODE } from '@common/constants/enums/error-code.enum';
import { CreateKeyCloakUserRequest } from '@common/interfaces/common';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateKeyCloakUserTcpRequest } from '@common/interfaces/tcp/keycloak';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
  ) {}

  async create(payload: CreateUserTcpRequest, processId: string) {
    const isExist = await this.userRepository.exists(payload.email);
    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(payload, processId);

    return this.userRepository.create(createUserRequestMapping(payload, userId));
  }

  getAll() {
    return this.userRepository.getAll();
  }

  private createKeycloakUser(data: CreateKeyCloakUserRequest, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<string, CreateKeyCloakUserTcpRequest>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
          data,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
