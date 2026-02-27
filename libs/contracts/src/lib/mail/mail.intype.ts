export type MailAttachment = {
  filename: string;
  content?: string | Buffer;
  contentType?: string;
  path?: string;
};

export type SendMailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  senderName?: string;
  senderMail?: string;
  attachments?: MailAttachment[];
};
