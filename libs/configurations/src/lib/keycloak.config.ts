import { IsNotEmpty, IsString } from 'class-validator';

export class KeycloakConfiguration {
  @IsString()
  @IsNotEmpty()
  URL: string;

  @IsString()
  @IsNotEmpty()
  REALM: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_SECRET: string;

  constructor() {
    this.URL = process.env['KEYCLOAK_URL'] || '';
    this.REALM = process.env['KEYCLOAK_REALM'] || '';
    this.CLIENT_ID = process.env['KEYCLOAK_CLIENT_ID'] || '';
    this.CLIENT_SECRET = process.env['KEYCLOAK_CLIENT_SECRET'] || '';
  }
}
