// import { IMailService } from '@core/interfaces/MailService';
import { IMailService } from '@core/interfaces/mail.service.interface';
import { IVerificationService } from '@core/interfaces/verification.service.interface';
import { inject, injectable } from 'inversify';

import { DiTypes } from '@ioc/di.types';

@injectable()
export class VerificationService implements IVerificationService {
  constructor(@inject(DiTypes.MailService) private mailService: IMailService) {}

  /** примерный метод для отправки конкретного вида писма   */
  async sendVerificationMail(email: string, link: string): Promise<void> {
    const html = `
     <div>
       <h1>Click on the link to activate your account</h1>
       <a href="${link}">${link}</a>
     </div>
   `;
    await this.mailService.sendMail(email, 'Account Activation', html);
  }
}
