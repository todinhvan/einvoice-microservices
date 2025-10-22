import { Injectable } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import { LoginTcpRequest } from '@common/interfaces/tcp/authorizer';

@Injectable()
export class AuthorizerService {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  async login(params: LoginTcpRequest) {
    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      params,
    );
    return { accessToken, refreshToken };
  }
}
