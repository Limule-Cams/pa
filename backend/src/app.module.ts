// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { CommonModule } from './common/common.module';
import { GlobalExceptionHandler } from './core/middleware/exception-handler.middleware';
import { createTypeOrmConfig } from './core/database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { CompanyModule } from './modules/company/company.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProviderModule } from './modules/provider/provider.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { PaymentModule } from './core/payment/payment.module';
import { PdfModule } from './core/pdf/pdf.module';
import { NotificationModule } from './core/notification/notification.module';
import * as path from 'path';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { mailerConfig } from './core/web/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmConfig,
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'fr',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV === 'development',
      },
      resolvers: [new AcceptLanguageResolver({ matchType: 'strict' })],
    }),
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
    ScheduleModule.forRoot(),

    CoreModule,
    CommonModule,
    AuthModule,
    AdminModule,
    CompanyModule,
    EmployeeModule,
    ProviderModule,
    ChatbotModule,
    PaymentModule,
    PdfModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionHandler,
    },
  ],
})
export class AppModule {}