export interface IMailService {
  sendMail(email: string, subject: string, html: string): Promise<void>;
}
