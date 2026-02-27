import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { SendMailOptions } from '@shared/contracts/mail/mail.intype';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_CONFIG.HOST'),
      port: this.configService.get<number>('MAIL_CONFIG.PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_CONFIG.USER'),
        pass: this.configService.get<string>('MAIL_CONFIG.PASSWORD'),
      },
    });
  }

  async sendMail(params: SendMailOptions) {
    const defaultSenderName = this.configService.get<string>('MAIL_CONFIG.SENDER_NAME');
    const defaultSenderMail = this.configService.get<string>('MAIL_CONFIG.SENDER_MAIL');

    try {
      const info = await this.transporter.sendMail({
        from: `${params.senderName || defaultSenderName} <${params.senderMail || defaultSenderMail}>`, // ABC <abc@abc.com>,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text ?? params.html.replace(/<[^>]+>/g, ''),
        attachments: params.attachments,
      });
      Logger.log(info);
      Logger.log(`Mail sent to ${params.to}: ${info.messageId}`);
    } catch (error) {
      Logger.error(`Error sending mail to ${params.to}: ${error}`);
      throw error;
    }
  }
}
