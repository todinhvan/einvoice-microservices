import { applyDecorators, SetMetadata } from '@nestjs/common';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Authorization = ({ secured = false }) => {
  const AuthorDecorator = SetMetadata(MetadataKeys.SECURED, { secured });

  if (secured) {
    return applyDecorators(AuthorDecorator, ApiBearerAuth());
  }

  return AuthorDecorator;
};
