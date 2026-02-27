import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MailConfiguration {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  USER: string;

  @IsString()
  @IsNotEmpty()
  PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  SENDER_NAME: string;

  @IsString()
  @IsNotEmpty()
  SENDER_MAIL: string;

  constructor() {
    this.HOST = process.env['NODEMAILER_HOST'] || '';
    this.PORT = Number(process.env['NODEMAILER_PORT']) || 587;
    this.USER = process.env['NODEMAILER_USERNAME'] || '';
    this.PASSWORD = process.env['NODEMAILER_PASSWORD'] || '';
    this.SENDER_NAME = process.env['NODEMAILER_SENDER_NAME'] || '';
    this.SENDER_MAIL = process.env['NODEMAILER_SENDER_EMAIL'] || '';
  }
}
