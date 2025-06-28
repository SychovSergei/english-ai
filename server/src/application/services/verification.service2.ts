import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { IMailService } from '@core/interfaces/mail.service.interface';
import { IVerificationService } from '@core/interfaces/verification.service.interface';
// import { ConfigService } from "@infrastructure/config/ConfigService";

@injectable()
export class VerificationService2 implements IVerificationService {
  constructor(
    // @inject(ConfigService) private configService: ConfigService,
    @inject(DiTypes.MailService) private mailService: IMailService,
  ) {}

  async sendVerificationMail(email: string, link: string) {
    const html = `
      <div>
        <h1>Click on the link to activate your account</h1>
        <a href="${link}">${link}</a>
      </div>
    `;
    // const api_url = this.configService.get("api_url");
    await this.mailService.sendMail(email, `Account activation - `, html);
  }
}
