export interface IVerificationService {
  sendVerificationMail(email: string, link: string): Promise<void>;
}
