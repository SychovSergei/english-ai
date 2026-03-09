import { inject, injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';

import { ConfigServicePort, EmailServicePort } from '@core/application/ports';

import { TYPES } from '@ioc/TYPES';

@injectable()
export class EmailNotificationService implements EmailServicePort {
  private transporter: Transporter;

  constructor(@inject(TYPES.ConfigService) private configService: ConfigServicePort) {
    const smtp = this.configService.get('smtp');

    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port, //(config.smtp as any).port,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: smtp.user, //config.smtp.user,
        pass: smtp.password, //config.smtp.password,
      },
      pool: true,
      tls: {
        rejectUnauthorized: false,
      },
    } as unknown as SMTPPool.Options);

    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    this.transporter.verify((error, success) => {
      if (error) console.log('VERIFY ERROR');
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    try {
      const smtp = this.configService.get('smtp');

      this.transporter.sendMail(
        {
          from: smtp.user, //config.smtp.user,
          to,
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
