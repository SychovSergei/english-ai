import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';

import { IMailService } from '@core/interfaces/mail.service.interface';
import { IConfigService } from '@application/ports/config-service.interface';

@injectable()
export class SMTPMailService implements IMailService {
  private transporter: Transporter;

  constructor(@inject(DiTypes.ConfigService) private configService: IConfigService) {
    const smtp = this.configService.get('smtp');
    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port, //(config.smtp as any).port,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: smtp.user, //config.smtp.user,
        pass: smtp.password, //config.smtp.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as any);
  }

  async sendMail(email: string, subject: string, html: string) {
    try {
      const smtp = this.configService.get('smtp');
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      this.transporter.verify((error, success) => {
        if (error) console.log('VERIFY ERROR');
      });
      this.transporter.sendMail(
        {
          from: smtp.user, //config.smtp.user,
          to: email,
          subject,
          text: 'some text',
          html,
        },
        (error, info) => {
          if (error) {
            console.error('Error sending email: ', error);
          } else {
            console.log('Email sent: ', info.response);
          }
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log('SendMail Error', e.code, e.message);
    }
  }
}
