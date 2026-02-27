import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KafkaConfiguration {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  URL: string;

  constructor() {
    this.HOST = process.env['KAFKA_HOST'] || '';
    this.PORT = Number(process.env['KAFKA_PORT']) || 9092;
    this.URL = process.env['KAFKA_URL'] || `${this.HOST}:${this.PORT}`;
  }
}
