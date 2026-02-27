import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import { toUser, toUserResponse } from '../mappers/user.mapper';
import { hashString } from '@shared/utils/string.util';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    @Inject(TcpServices.AUTHORIZER) private readonly authorizerClient: TcpClient,
  ) {
    this.saltRounds = configService.get<number>('APP_CONFIG.HASH_SALT_ROUNDS');
  }

  async createUser(data: CreateUserTCP, processId: string) {
    const exists = await this.userRepository.exists(data.email);
    if (exists) {
      throw new ConflictException(ErrorMessages.USER_ALREADY_EXISTS);
    }

    let user = toUser(data);
    const keycloakUserId = await this.fetchKeycloakUserId(data, processId);
    const hashPassword = await hashString(user.password, this.saltRounds);
    user.keycloakUserId = keycloakUserId;
    user.password = hashPassword;

    try {
      user = await this.userRepository.create(user);

      const userPopulated = await this.existsUser(user.id);
      return toUserResponse(userPopulated);
    } catch {
      throw new NotFoundException(ErrorMessages.ROLE_NOT_FOUND);
    }
  }

  async getUser(id: string) {
    const userPopulated = await this.existsUser(id);
    return toUserResponse(userPopulated);
  }

  async getUserByKeycloakUserId(keycloakUserId: string) {
    const userPopulated = await this.userRepository.findByKeycloakUserId(keycloakUserId);
    if (!userPopulated) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return toUserResponse(userPopulated);
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => toUserResponse(user));
  }

  private async existsUser(id: string) {
    const userPopulated = await this.userRepository.findById(new ObjectId(id));
    if (!userPopulated) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return userPopulated;
  }

  private async fetchKeycloakUserId(data: CreateUserTCP, processId: string) {
    return await firstValueFrom(
      this.authorizerClient
        .send<string, CreateUserTCP>(TcpMessages.AUTHORIZER.CREATE_KEYCLOAK_USER, { processId, data })
        .pipe(map((response) => response.data)),
    );
  }
}
