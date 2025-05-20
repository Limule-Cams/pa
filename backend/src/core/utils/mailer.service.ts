import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, context?: any) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error.stack);
      throw error;
    }
  }

  async sendHtmlMail(to: string, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html, // Send HTML content directly
      });
      this.logger.log(`HTML Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending HTML email to ${to}`, error.stack);
      throw error;
    }
  }
}
