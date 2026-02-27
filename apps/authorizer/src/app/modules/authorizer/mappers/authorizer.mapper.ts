import { CreateUserTCP } from '@shared/contracts/user-access/user/user-request.type';
import { CreateKeycloakUserRequest, Credential } from '@shared/contracts/keycloak/keycloak-request.type';
import { ExchangeUserTokenResponse } from '@shared/contracts/keycloak/keycloak-response.type';
import {
  AuthorizedMetadata,
  AuthorizerResponse,
  LoginResponse,
} from '@shared/contracts/authorizer/authorizer-response.type';
import { UserResponse } from '@shared/contracts/user-access/user/user-response.type';
import { JwtPayload } from 'jsonwebtoken';

export const toKeycloakUser = (data: CreateUserTCP): CreateKeycloakUserRequest => {
  const credential = new Credential();
  credential.type = 'password';
  credential.value = data.password;
  credential.temporary = false;

  const body = new CreateKeycloakUserRequest();
  body.username = data.email;
  body.enabled = true;
  body.email = data.email;
  body.emailVerified = true;
  body.firstName = data.firstName;
  body.lastName = data.lastName;
  body.credentials = [credential];
  return body;
};

export const toLoginResponse = (data: ExchangeUserTokenResponse): LoginResponse => {
  const response = new LoginResponse();
  response.accessToken = data.access_token;
  response.refreshToken = data.refresh_token;
  return response;
};

export const toAuthorizerResponse = (data: UserResponse, payload: JwtPayload): AuthorizerResponse => {
  const metadata = new AuthorizedMetadata();
  metadata.jwt = payload;
  metadata.user = data;
  metadata.userId = data.id;
  metadata.permissions = data.roles.map((role) => role.permissions).flat();

  const response = new AuthorizerResponse();
  response.valid = true;
  response.metadata = metadata;
  return response;
};
