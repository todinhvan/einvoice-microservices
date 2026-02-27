import { Logger } from '@nestjs/common';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export class BaseConfiguration {
  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_PREFIX: string;

  constructor() {
    this.NODE_ENV = process.env['NODE_ENV'] || 'development';
    this.GLOBAL_PREFIX = process.env['GLOBAL_PREFIX'] || 'api/v1';
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      Logger.error(errors);
      throw new Error('Configuration is invalid');
    }
  }
}
