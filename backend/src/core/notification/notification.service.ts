import {
  CreateNotificationSuccessResponse,
  DefaultApi as OneSignalApi,
  Notification,
} from '@onesignal/node-onesignal';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingEntity } from '../../common/entity/booking.entity';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { InvoiceEntity } from '../../common/entity/invoice.entity';

const OneSignalModule = require('@onesignal/node-onesignal');
const Configuration = OneSignalModule.Configuration;

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private oneSignalClient: OneSignalApi | null = null;
  private readonly ONESIGNAL_APP_ID: string | undefined;
  private readonly IS_ENABLED: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = configService.get<string>('ONESIGNAL_API_KEY');
    const appId = configService.get<string>('ONESIGNAL_APP_ID');
    this.ONESIGNAL_APP_ID = appId;

    if (apiKey && appId) {
      try {
        if (typeof Configuration !== 'function') {
          throw new Error('Configuration is not a constructor!');
        }

        const configuration = new (Configuration as any)({
          apiKeys: {
            userKey: apiKey,
          },
        });

        this.oneSignalClient = new OneSignalApi(configuration);
        this.logger.log('OneSignal Service Initialized successfully.');
        this.IS_ENABLED = true;
      } catch (error: any) {
        this.logger.error(
          'Failed to initialize OneSignal Client:',
          error.message,
          error.stack,
        );
        this.oneSignalClient = null;
        this.IS_ENABLED = false;
      }
    } else {
      this.logger.warn(
        'OneSignal API Key or App ID not found. Push notifications disabled.',
      );
      this.IS_ENABLED = false;
      this.oneSignalClient = null;
    }
  }

  isAvailable(): boolean {
    return (
      this.IS_ENABLED &&
      this.oneSignalClient !== null &&
      typeof this.ONESIGNAL_APP_ID === 'string'
    );
  }

  async sendNotification(
    externalUserId: string | number,
    title: string,
    message: string,
    data?: Record<string, any>,
    url?: string,
  ): Promise<void> {
    if (!this.isAvailable()) {
      this.logger.warn(
        `Skipping notification (OneSignal disabled/misconfigured): User ${externalUserId} - ${title}`,
      );
      return;
    }
    const client = this.oneSignalClient!;
    const appId = this.ONESIGNAL_APP_ID!;

    this.logger.log(
      `Sending OneSignal notification to user ${externalUserId}: "${title}"`,
    );

    try {
      const notification: Notification = {
        app_id: appId,
        filters: [
          {
            field: 'tag',
            key: 'user_id',
            relation: '=',
            value: String(externalUserId),
          },
        ],
        headings: { en: title, fr: title },
        contents: { en: message, fr: message },
        data: data,
        web_url: url,
        app_url: url,
      };

      const response: CreateNotificationSuccessResponse =
        await client.createNotification(notification);

      if (response.id) {
        this.logger.log(
          `OneSignal notification sent: ${response.id} targeted via tag user_id=${externalUserId}.`,
        );
      } else {
        this.logger.error(
          `OneSignal notification may have failed for user_id ${externalUserId}. Response: ${JSON.stringify(
            response,
          )}`,
        );
      }
    } catch (error: any) {
      const errorDetails = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error.stack;
      this.logger.error(
        `Failed to send OneSignal notification to user_id ${externalUserId}: ${error.message}`,
        errorDetails,
      );
    }
  }

  async sendEmployeeInvitation(
    email: string,
    companyName: string,
    temporaryPassword?: string,
  ): Promise<void> {
    this.logger.log(
      `Placeholder: Invitation process for ${email} to join ${companyName}. Temp pwd: ${
        temporaryPassword ? 'yes' : 'no'
      }`,
    );
  }

  async sendBookingConfirmation(
    userId: number,
    booking: BookingEntity,
  ): Promise<void> {
    const serviceName =
      booking.service?.title || booking.event?.name || 'votre activité';
    const dateStr = booking.bookingDate.toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    await this.sendNotification(
      userId,
      'Réservation confirmée',
      `Votre réservation pour ${serviceName} le ${dateStr} est confirmée.`,
      { bookingId: booking.id, type: 'booking_confirmation' },
    );
  }

  async sendProviderValidationUpdate(
    providerUserId: number,
    status: ContractStatus,
    isVerified: boolean,
  ): Promise<void> {
    const title = 'Mise à jour de votre statut';
    const message = `Votre statut de prestataire a été mis à jour: ${status}. ${
      isVerified
        ? 'Votre profil est maintenant vérifié.'
        : "Votre profil n'est plus vérifié."
    }`;
    await this.sendNotification(providerUserId, title, message, {
      type: 'provider_status_update',
    });
  }

  async sendNewProviderInvoice(
    providerUserId: number,
    invoice: InvoiceEntity,
  ): Promise<void> {
    const title = 'Nouvelle facture disponible';
    const message = `Votre facture N°${invoice.invoiceNumber} pour un montant de ${
      invoice.totalAmount
    }€ est disponible.`;
    await this.sendNotification(providerUserId, title, message, {
      invoiceId: invoice.id,
      type: 'new_invoice',
    });
  }
}