import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import { LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { ConfigService } from '@nestjs/config';
import { JwksClient } from 'jwks-rsa';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { AuthorizerResponse } from '@common/interfaces/tcp/authorizer';
import { firstValueFrom, map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { UserTcpResponse } from '@common/interfaces/tcp/user';
import { Role } from '@common/schemas/role.schema';
import { UserService } from '@common/interfaces/grpc/user';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;
  private userService: UserService;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
    @Inject(GRPC_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessGrpcClient: ClientGrpc,
  ) {
    const host = this.configService.get<string>('KEYCLOAK_CONFIG.HOST');
    const realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM');

    this.jwksClient = new JwksClient({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  onModuleInit() {
    this.userService = this.userAccessGrpcClient.getService<UserService>('UserService');
  }

  async login(params: LoginTcpRequest) {
    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      params,
    );
    return { accessToken, refreshToken };
  }

  async verifyUserToken(token: string, processId: string): Promise<AuthorizerResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      this.logger.debug({ payload });

      const user = await this.userValidation(payload.sub, processId);

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: (user.roles as unknown as Role[]).flatMap((role) => role.permissions),
          user,
          userId: user.id,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async userValidation(token: string, processId: string) {
    const user = await this.getUserInfo(token, processId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async getUserInfo(token: string, processId: string) {
    // return firstValueFrom(
    //   this.userAccessClient
    //     .send<UserTcpResponse, string>(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID, {
    //       data: token,
    //       processId,
    //     })
    //     .pipe(
    //       map((data) => {
    //         Logger.log('getUserInfo response data:', data);
    //         return data.data;
    //       }),
    //     ),
    // );
    const response = await firstValueFrom(this.userService.getUserInfo({ token }));
    return response.data;
  }
}
