export interface EmailServicePort {
  send(to: string, subject: string, html: string): Promise<void>;
}
