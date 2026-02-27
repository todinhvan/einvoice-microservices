export class Credential {
  type: string;
  value: string;
  temporary: boolean;
}

export class CreateKeycloakUserRequest {
  username: string;
  enabled: boolean;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  credentials: Credential[];
}
