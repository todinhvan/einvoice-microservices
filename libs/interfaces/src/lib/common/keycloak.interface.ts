export type ExchangeClientTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
  scope: string;
};

export type CreateKeyCloakUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ExchangeUserTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
  scope: string;
  refresh_token: string;
  session_state: string;
};
