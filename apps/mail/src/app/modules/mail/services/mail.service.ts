import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { SendMailOptions } from '@common/interfaces/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_CONFIG.HOST'),
      port: configService.get('MAIL_CONFIG.PORT'),
      secure: false,
      auth: {
        user: configService.get('MAIL_CONFIG.USERNAME'),
        pass: configService.get('MAIL_CONFIG.PASSWORD'),
      },
    });
  }

  async sendMail({ to, subject, html, text, senderName, senderEmail, attachments }: SendMailOptions) {
    const defaultSenderName = this.configService.get('MAIL_CONFIG.SENDER_NAME');
    const defaultSenderEmail = this.configService.get('MAIL_CONFIG.SENDER_EMAIL');

    const mailOptions = {
      from: `"${senderName ?? defaultSenderName}" <${senderEmail ?? defaultSenderEmail}>`,
      to,
      subject,
      html,
      text: text ?? html.replace(/<[^>]+>/g, ''),
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }
}
