// src/mail/mailer.config.ts
import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerConfig: MailerOptions = {
  transport: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD,
    },
  },
  defaults: {
    from: `"No Reply" <${process.env.GMAIL_USER}>`,
  },
  template: {
    dir: __dirname + '/templates',
    options: {
      strict: true,
    },
  },
};
