import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../user-access/user/user-response.type';
import { PERMISSION } from '@shared/constants/enums/permission.enum';
import { JwtPayload } from 'jsonwebtoken';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class AuthorizedMetadata {
  userId: string;
  user: UserResponse;
  permissions: PERMISSION[];
  jwt: JwtPayload;
}

export class AuthorizerResponse {
  valid: boolean;
  metadata?: AuthorizedMetadata;
}

export type VerifyTokenGrpcResponse = {
  valid: boolean;
  metadata?: AuthorizedMetadata;
};
