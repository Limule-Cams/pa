import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from '../../common/entity/contract.entity';
import { Between, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { NotificationEntity } from '../../common/entity/notification.entity';
import { SubscriptionTier } from '../../common/enum/subscription-tier.enum';
import {
  BookingEntity,
  BookingStatus,
} from '../../common/entity/booking.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceStatus } from '../../common/enum/invoice-status.enum';
import { PdfService } from '../pdf/pdf.service';

interface GroupedBookings {
  [providerId: string]: {
    [companyId: string]: BookingEntity[];
  };
}

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly pdfService: PdfService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredContracts() {
    try {
      const now = new Date();
      const expiredContracts = await this.contractRepository
        .createQueryBuilder('contract')
        .leftJoinAndSelect('contract.company', 'company')
        .leftJoinAndSelect('company.user', 'user')
        .where('contract.endDate < :now', { now })
        .andWhere('contract.status != :inactive', {
          inactive: ContractStatus.INACTIVE,
        })
        .getMany();

      let updatedCount = 0;
      const notificationPromises: Promise<NotificationEntity>[] = [];

      for (const contract of expiredContracts) {
        contract.status = ContractStatus.INACTIVE;
        await this.contractRepository.save(contract);
        updatedCount++;

        if (contract.company?.user) {
          const notification = this.notificationRepository.create({
            title: `Contrat Expiré: ${this.getTierName(contract.subscriptionTier)}`,
            message: this.getExpirationMessage(contract),
            user: contract.company.user,
            isRead: false,
          });
          notificationPromises.push(
            this.notificationRepository.save(notification),
          );
        }
      }

      await Promise.all(notificationPromises);
      this.logger.log(
        `Mise à jour de ${updatedCount} contrats au statut INACTIF et création de ${notificationPromises.length} notifications`,
      );
    } catch (error) {
      this.logger.error(
        'Échec de la mise à jour des contrats expirés',
        error.stack,
      );
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleMonthlyInvoicing() {
    const now = new Date();
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const bookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.COMPLETED,
        bookingDate: Between(
          firstDayOfLastMonth,
          new Date(lastDayOfLastMonth.setHours(23, 59, 59, 999)),
        ),
      },
      relations: ['service', 'employee', 'employee.company', 'provider'],
    });

    const grouped: GroupedBookings = this.groupBookings(bookings);

    for (const [providerId, companies] of Object.entries(grouped)) {
      for (const [companyId, providerCompanyBookings] of Object.entries(
        companies,
      )) {
        const totalAmount = providerCompanyBookings.reduce(
          (sum, booking) => sum + Number(booking.service?.price ?? 0),
          0,
        );

        const invoice = this.invoiceRepository.create({
          invoiceNumber: this.generateInvoiceNumber(providerId),
          invoiceDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: InvoiceStatus.PENDING,
          provider: { id: +providerId },
          company: { id: +companyId },
          totalAmount,
          description: `Services summary for ${new Date().toLocaleString('default', { month: 'long' })}`,
        });

        if (this.pdfService) {
          const pdfUrl = await this.pdfService.generateInvoicePDF(
            invoice,
            providerCompanyBookings,
          );
          invoice.documentUrl = pdfUrl;
          await this.invoiceRepository.save(invoice);
        } else {
          console.error('PDF Service is not available');
        }
      }
    }
  }

  private groupBookings(bookings: BookingEntity[]): GroupedBookings {
    return bookings.reduce((grouped, booking) => {
      const providerId = booking.provider?.id?.toString() || 'unknown';
      const companyId = booking.employee?.company?.id?.toString() || 'unknown';

      if (!grouped[providerId]) {
        grouped[providerId] = {};
      }

      if (!grouped[providerId][companyId]) {
        grouped[providerId][companyId] = [];
      }

      grouped[providerId][companyId].push(booking);
      return grouped;
    }, {} as GroupedBookings);
  }

  private generateInvoiceNumber(providerId: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `BC-PROV-${year}${String(month).padStart(2, '0')}-${providerId}-${uuidv4().substring(0, 4)}`;
  }

  private getExpirationMessage(contract: ContractEntity): string {
    const endDate = contract.endDate.toLocaleDateString('fr-FR');
    return `Le contrat #${contract.id} (${this.getTierName(contract.subscriptionTier)}) a expiré le ${endDate}.`;
  }

  private getTierName(tier: string): string {
    const tierNames: Record<string, string> = {
      [SubscriptionTier.BASIC]: 'Basique',
      [SubscriptionTier.STARTER]: 'Starter',
      [SubscriptionTier.PREMIUM]: 'Premium',
    };
    return tierNames[tier] || tier;
  }
}
