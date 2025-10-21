import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ExchangeClientTokenResponse } from '@common/interfaces/common';
import { CreateKeyCloakUserTcpRequest } from '@common/interfaces/tcp/keycloak';

@Injectable()
export class KeycloakHttpService {
  private readonly logger = new Logger(KeycloakHttpService.name);

  private readonly axiosInstance: AxiosInstance;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('KEYCLOAK_CONFIG.HOST'),
    });
    this.realm = this.configService.get('KEYCLOAK_CONFIG.REALM');
    this.clientId = this.configService.get('KEYCLOAK_CONFIG.CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CONFIG.CLIENT_SECRET');
  }

  async exchangeClientToken(): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post(`/realms/${this.realm}/protocol/openid-connect/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  }

  async createUser(data: CreateKeyCloakUserTcpRequest): Promise<string> {
    const { firstName, lastName, email, password } = data;
    const { access_token: accessToken } = await this.exchangeClientToken();

    const { headers } = await this.axiosInstance.post(
      `/admin/realms/${this.realm}/users`,
      {
        username: email,
        enabled: true,
        email,
        emailVerified: true,
        firstName,
        lastName,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const userId = headers['location']?.split('/')?.pop();

    if (!userId) {
      throw new InternalServerErrorException('Failed to create keycloak user');
    }

    this.logger.debug(`Created Keycloak user with ID: ${userId}`);
    return userId;
  }
}
