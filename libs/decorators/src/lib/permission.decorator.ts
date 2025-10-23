import { PERMISSION } from '@common/constants/enums/permission.enum';
import { Reflector } from '@nestjs/core';

export const Permissions = Reflector.createDecorator<PERMISSION[]>();
