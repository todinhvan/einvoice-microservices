export type Attachment = {
  filename: string;
  content?: string | Buffer;
  contentType?: string;
  path?: string;
};

export interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  senderName?: string;
  senderEmail?: string;
  attachments?: Attachment[];
}
