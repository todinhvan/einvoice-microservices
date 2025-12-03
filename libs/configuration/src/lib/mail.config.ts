import { IsNotEmpty, IsString } from 'class-validator';

export class MailConfiguration {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsString()
  @IsNotEmpty()
  PORT: string;

  @IsString()
  @IsNotEmpty()
  USERNAME: string;

  @IsString()
  @IsNotEmpty()
  PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  SENDER_NAME: string;

  @IsString()
  @IsNotEmpty()
  SENDER_EMAIL: string;

  constructor() {
    this.HOST = process.env['MAIL_HOST'] || '';
    this.PORT = process.env['MAIL_PORT'] || '';
    this.USERNAME = process.env['MAIL_USERNAME'] || '';
    this.PASSWORD = process.env['MAIL_PASSWORD'] || '';
    this.SENDER_NAME = process.env['MAIL_SENDER_NAME'] || '';
    this.SENDER_EMAIL = process.env['MAIL_SENDER_EMAIL'] || '';
  }
}
