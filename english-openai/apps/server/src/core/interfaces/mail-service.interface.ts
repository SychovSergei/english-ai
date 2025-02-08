export interface IEmailService {
  sendMail(email: string, subject: string, html: string): Promise<void>;
}
