import { Reflector } from '@nestjs/core';
import { PERMISSION } from '@shared/constants/enums/permission.enum';

export const Permissions = Reflector.createDecorator<PERMISSION[]>();
