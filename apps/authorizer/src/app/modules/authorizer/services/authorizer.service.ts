import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  ExchangeClientTokenResponse,
  ExchangeUserTokenResponse,
} from '@shared/contracts/keycloak/keycloak-response.type';
import { LoginTCP } from '@shared/contracts/authorizer/authorizer-request.type';
import { CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { toAuthorizerResponse, toKeycloakUser, toLoginResponse } from '../mappers/authorizer.mapper';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { UserAccessService } from '@shared/contracts/grpc/user-access/user-access.interface';
import { GrpcServices } from '@shared/constants/enums/grpc-service.enum';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthorizerService {
  private axiosInstance: AxiosInstance;
  private url: string;
  private realm: string;
  private clientId: string;
  private clientSecret: string;
  private jwksClient: JwksClient;
  private userAccessService: UserAccessService;

  constructor(
    private readonly configService: ConfigService,
    @Inject(TcpServices.USER_ACCESS) private readonly userAccessClient: TcpClient,
    @Inject(GrpcServices.USER_ACCESS) private readonly userAccessGrpcClient: ClientGrpc,
  ) {
    this.url = configService.get<string>('KEYCLOAK_CONFIG.URL');
    this.realm = configService.get<string>('KEYCLOAK_CONFIG.REALM');
    this.clientId = configService.get<string>('KEYCLOAK_CONFIG.CLIENT_ID');
    this.clientSecret = configService.get<string>('KEYCLOAK_CONFIG.CLIENT_SECRET');

    this.axiosInstance = axios.create({
      baseURL: this.url,
    });

    const host = configService.get<string>('KEYCLOAK_CONFIG.URL');
    const realm = configService.get<string>('KEYCLOAK_CONFIG.REALM');
    this.jwksClient = new JwksClient({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  onModuleInit() {
    this.userAccessService = this.userAccessGrpcClient.getService<UserAccessService>('UserAccessService');
  }

  async exchangeClientToken() {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post<ExchangeClientTokenResponse>(
      `/realms/${this.realm}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data.access_token;
  }

  async exchangeUserToken(request: LoginTCP) {
    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('username', request.email);
    body.append('password', request.password);
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post<ExchangeUserTokenResponse>(
      `/realms/${this.realm}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return toLoginResponse(data);
  }

  async createUser(data: CreateUserTCP) {
    const body = toKeycloakUser(data);
    const accessToken = await this.exchangeClientToken();
    const { headers } = await this.axiosInstance.post(`/admin/realms/${this.realm}/users`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = headers['location']?.split('/').pop() ?? null;
    if (!userId) {
      throw new BadRequestException(ErrorMessages.CREATE_KEYCLOAK_USER_FAILED);
    }

    return userId as string;
  }

  async verifyToken(token: string, processId: string) {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    try {
      const signingKey = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = signingKey.getPublicKey();

      const jwtpayload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      const userInfo = await this.fetchUserInfo(jwtpayload.sub, processId);

      return toAuthorizerResponse(userInfo, jwtpayload);
    } catch (error) {
      Logger.error({ error });
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
  }

  async fetchUserInfo(keycloakUserId: string, processId: string) {
    // return await firstValueFrom(
    //   this.userAccessClient
    //     .send<UserResponse, string>(TcpMessages.USER.GET_BY_KEYCLOAK_USER_ID, { processId, data: keycloakUserId })
    //     .pipe(map((response) => response.data)),
    // );
    return await firstValueFrom(
      this.userAccessService
        .getUserByKeycloakUserId({ keycloakUserId, processId })
        .pipe(map((response) => response.data)),
    );
  }
}
