import nodemailer, { Transporter } from "nodemailer";

import config from "../../config";
import { IEmailService } from "../../core/interfaces/mail-service.interface";
import { inject, injectable } from "inversify";
import { ConfigService } from "../config/ConfigService";

@injectable()
export class SMTPMailService implements IEmailService {
  private transporter: Transporter;

  constructor(@inject(ConfigService) private configService: ConfigService) {
    const smtp = this.configService.get("smtp");
    this.transporter = nodemailer.createTransport({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      host: smtp.host,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      port: (config.smtp as any).port,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(email: string, subject: string, html: string) {
    try {
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      this.transporter.verify((error, success) => {
        if (error) console.log("VERIFY ERROR");
      });
      this.transporter.sendMail(
        {
          from: config.smtp.user,
          to: email,
          subject,
          text: "some text",
          html,
        },
        (error, info) => {
          if (error) {
            console.error("Error sending email: ", error);
          } else {
            console.log("Email sent: ", info.response);
          }
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log("SendMail Error", e.code, e.message);
    }
  }
}
