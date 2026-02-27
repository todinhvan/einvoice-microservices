import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ type: [String] })
  roleIds: string[];
}

export type CreateUserTCP = CreateUserRequestDTO;

export type GetUserByKeycloakUserIdGrpcRequest = {
  keycloakUserId: string;
  processId: string;
};
