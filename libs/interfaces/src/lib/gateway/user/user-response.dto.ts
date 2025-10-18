import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDTO } from '../common/base-response.dto';

export class UserResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string[];
}
