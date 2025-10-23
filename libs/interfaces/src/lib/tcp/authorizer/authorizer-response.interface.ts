import { User } from '@common/schemas/user.schema';
import { PERMISSION } from '@common/constants/enums/permission.enum';
import { JwtPayload } from 'jsonwebtoken';

export class AuthorizedMetadata {
  userId: string | undefined;
  user: User | undefined;
  permissions: PERMISSION[] | undefined;
  jwt: JwtPayload | undefined;

  constructor(payload?: Partial<AuthorizedMetadata>) {
    Object.assign(this, payload);
  }
}

export class AuthorizerResponse {
  valid = false;
  metadata = new AuthorizedMetadata();

  constructor(payload?: Partial<AuthorizerResponse>) {
    Object.assign(this, payload);
  }
}
