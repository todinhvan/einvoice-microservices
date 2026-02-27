import { IsNumber } from 'class-validator';

export class AppConfiguration {
  @IsNumber()
  PORT: number;

  @IsNumber()
  HASH_SALT_ROUNDS: number;

  constructor(data: Partial<AppConfiguration> & { PORT: number }) {
    this.PORT = data.PORT;
    this.HASH_SALT_ROUNDS = data.HASH_SALT_ROUNDS || Number(process.env['HASH_SALT_ROUNDS']) || 8;
  }
}
