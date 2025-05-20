import { Module } from '@nestjs/common';
import { HashUtils } from './utils/hash.utils';
import { SchedulerService } from './utils/scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from '../common/entity/contract.entity';
import { NotifierService } from './notification/notifier.service';
import { NotificationEntity } from '../common/entity/notification.entity';
import { BookingEntity } from '../common/entity/booking.entity';
import { InvoiceEntity } from '../common/entity/invoice.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './utils/mailer.service';

@Module({
  imports: [
    MailerModule.forRoot({
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
    }),
    TypeOrmModule.forFeature([
      ContractEntity,
      NotificationEntity,
      BookingEntity,
      InvoiceEntity,
    ]),
  ],
  providers: [HashUtils, SchedulerService, NotifierService, EmailService],
  exports: [HashUtils, NotifierService, SchedulerService, EmailService],
})
export class CoreModule {}