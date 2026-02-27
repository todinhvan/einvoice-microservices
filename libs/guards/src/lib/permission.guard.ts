import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permissions } from '@shared/decorators/permission.decorator';
import { PERMISSION } from '@shared/constants/enums/permission.enum';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { AuthorizedMetadata } from '@shared/contracts/authorizer/authorizer-response.type';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<PERMISSION[]>(Permissions, context.getHandler());
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const metadata = request[MetadataKeys.AUTHORIZED_DATA] as AuthorizedMetadata;

    const isValid = permissions.every((permission) => metadata.permissions.includes(permission));
    if (!isValid) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN);
    }

    return isValid;
  }
}
