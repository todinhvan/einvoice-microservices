import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LokiConfiguration {
  @IsString()
  @IsNotEmpty()
  URL: string;

  @IsBoolean()
  ENABLE_PUSH: boolean;

  constructor() {
    this.URL = process.env['LOKI_URL'] || '';
    this.ENABLE_PUSH = process.env['LOKI_ENABLE_PUSH'] === 'true' || false;
  }
}
