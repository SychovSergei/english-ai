import { inject, injectable } from "inversify";

import { SMTPMailService } from "../../../infractructure/services/SmtpMailService";

import { ConfigService } from "../../../infractructure/config/ConfigService";

@injectable()
export class VerificationService {
  constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(SMTPMailService) private mailService: SMTPMailService,
  ) {}

  async sendVerificationMail(email: string, link: string) {
    const html = `
      <div>
        <h1>Click on the link to activate your account</h1>
        <a href="${link}">${link}</a>
      </div>
    `;
    const api_url = this.configService.get("api_url");
    await this.mailService.sendMail(email, `Account activation - ` + api_url, html);
  }
}
