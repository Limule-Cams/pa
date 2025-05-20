import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm'; // Ajout LessThan, MoreThan
import { ProviderEntity } from './provider.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { SlotStatus } from '../../common/enum/slot-status.enum'; // Adapte le chemin si besoin
import {
  BookingEntity,
  BookingStatus,
} from '../../common/entity/booking.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';
import { ProviderProfileDto } from './dto/provider-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';
import { AvailabilitySlotDto } from './dto/availability-slot.dto';
import { InterventionDto } from './dto/intervention.dto';
import { EvaluationDto } from './dto/evaluation.dto';
import { ServiceEntity } from '../../common/entity/service.entity';
import { CertificationEntity } from '../../common/entity/certification.entity';

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);

  constructor(
    @InjectRepository(ProviderEntity)
    private readonly providerRepository: Repository<ProviderEntity>,
    @InjectRepository(AvailabilitySlotEntity)
    private readonly availabilitySlotRepository: Repository<AvailabilitySlotEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findProviderByUserId(userId: number): Promise<ProviderEntity> {
    const provider = await this.providerRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'user',
        'certifications',
        'bookings',
        'invoices',
        'bookings.employee',
      ], // Charger relations de base
    });
    if (!provider) {
      throw new ForbiddenException(
        `Access Denied. Provider profile not found for user ID ${userId}`,
      );
    }
    return provider;
  }

  async getProfile(userId: number): Promise<any> {
    const provider = await this.findProviderByUserId(userId);
    return {
      id: provider.id,
      userId: provider.user.id,
      email: provider.user.email,
      firstName: provider.firstName,
      lastName: provider.lastName,
      address: provider.address,
      phoneNumber: provider.phoneNumber,
      isAvailable: provider.isAvailable,
      isVerified: provider.isVerified,
      rating: provider.rating,
      bankAccountNumber: provider.bankAccountNumber,
      validationStatus: provider.validationStatus,
      certifications: provider.certifications.map((c) => ({
        id: c.id,
        title: c.title,
        issuingAuthority: c.issuingAuthority,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        documentUrl: c.documentUrl,
        isVerified: c.isVerified,
      })),
    };
  }

  async updateProfile(
    userId: number,
    updateDto: UpdateProviderProfileDto,
  ): Promise<ProviderProfileDto> {
    const provider = await this.findProviderByUserId(userId);

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] !== undefined && key in provider) {
        const allowedToUpdate = [
          'firstName',
          'lastName',
          'address',
          'phoneNumber',
          'isAvailable',
          'bankAccountNumber',
        ];
        if (allowedToUpdate.includes(key)) {
          provider[key] = updateDto[key];
        } else {
          this.logger.warn(
            `Attempted to update protected field '${key}' for provider ${provider.id}`,
          );
        }
      }
    });

    try {
      await this.providerRepository.save(provider);
      this.logger.log(`Profile updated for provider user ${userId}`);
      return this.getProfile(userId);
    } catch (error) {
      this.logger.error(
        `Failed to update profile for provider user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not update profile.');
    }
  }

  async getAvailability(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<AvailabilitySlotDto[]> {
    const provider = await this.findProviderByUserId(userId);
    const slots = await this.availabilitySlotRepository.find({
      where: {
        providerId: provider.id,
        startTime: LessThan(endDate),
        endTime: MoreThan(startDate),
      },
      order: { startTime: 'ASC' },
    });

    return slots.map((s) => ({
      id: s.id,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      status: s.status,
    }));
  }

  async addAvailability(
    userId: number,
    slotDto: AvailabilitySlotDto,
  ): Promise<AvailabilitySlotDto> {
    const provider = await this.findProviderByUserId(userId);
    const startTime = new Date(slotDto.startTime);
    const endTime = new Date(slotDto.endTime);

    if (
      isNaN(startTime.getTime()) ||
      isNaN(endTime.getTime()) ||
      startTime >= endTime
    ) {
      throw new BadRequestException('Invalid start or end time provided.');
    }

    const overlappingSlots = await this.availabilitySlotRepository.count({
      where: {
        providerId: provider.id,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlappingSlots > 0) {
      throw new BadRequestException(
        'The new availability slot overlaps with an existing one.',
      );
    }

    const newSlot = this.availabilitySlotRepository.create({
      providerId: provider.id,
      provider: provider,
      startTime: startTime,
      endTime: endTime,
      status: SlotStatus.AVAILABLE,
    });

    try {
      const savedSlot = await this.availabilitySlotRepository.save(newSlot);
      this.logger.log(
        `Availability slot [${savedSlot.startTime.toISOString()}-${savedSlot.endTime.toISOString()}] added for provider user ${userId}`,
      );
      return {
        id: savedSlot.id,
        startTime: savedSlot.startTime.toISOString(),
        endTime: savedSlot.endTime.toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to add availability for provider user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Could not add availability slot.',
      );
    }
  }

  async removeAvailability(userId: number, slotId: number): Promise<void> {
    const provider = await this.findProviderByUserId(userId);
    const slot = await this.availabilitySlotRepository.findOne({
      where: { id: slotId, providerId: provider.id },
    });

    if (!slot) {
      throw new NotFoundException(
        `Availability slot ${slotId} not found for this provider.`,
      );
    }
    if (slot.status === SlotStatus.BOOKED) {
      throw new BadRequestException(
        `Cannot remove availability slot ${slotId} because it is currently booked.`,
      );
    }

    const result = await this.availabilitySlotRepository.delete(slotId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Availability slot ${slotId} could not be deleted.`,
      );
    }
    this.logger.log(
      `Availability slot ${slotId} (Status: ${slot.status}) removed for provider user ${userId}`,
    );
  }

  async getInterventions(
    userId: number,
    status?: BookingStatus,
  ): Promise<InterventionDto[]> {
    const provider = await this.findProviderByUserId(userId);
    const whereCondition: FindOptionsWhere<BookingEntity> = {
      service: { provider: { id: provider.id } },
    };
    if (status) {
      whereCondition.status = status;
    } else {
      whereCondition.status = In([
        BookingStatus.CONFIRMED,
        BookingStatus.COMPLETED,
        BookingStatus.NO_SHOW,
      ]);
    }

    const bookings = await this.bookingRepository.find({
      where: whereCondition,
      relations: ['service', 'employee', 'employee.company', 'event'],
      order: { bookingDate: 'DESC' },
    });

    return bookings.map((b) => ({
      bookingId: b.id,
      bookingDate: b.bookingDate,
      status: b.status,
      serviceTitle: b.service?.title || 'Service non spécifié',
      itemType: 'Service',
      employeeName: b.employee
        ? `${b.employee.name} ${b.employee.lastName}`
        : 'N/A',
      companyName: b.employee?.company?.name ?? 'N/A',
      location: 'À définir', // TODO: Ajouter location à ServiceEntity
      notes: b.notes,
    }));
  }

  async getEvaluations(userId: number): Promise<EvaluationDto[]> {
    const provider = await this.findProviderByUserId(userId);
    const evaluations = await this.evaluationRepository.find({
      where: { providerId: provider.id },
      relations: [
        'ratedByEmployee',
        'booking',
        'booking.service',
        'booking.event',
      ],
      order: { createdAt: 'DESC' },
    });

    return evaluations.map((e) => ({
      id: e.id,
      rating: e.rating,
      comment: e.comment,
      createdAt: e.createdAt,
      employeeName: e.ratedByEmployee
        ? `${e.ratedByEmployee.name} ${e.ratedByEmployee.lastName}`
        : 'Employé (supprimé/anonyme)',
      serviceTitle:
        e.booking?.service?.title ||
        e.booking?.event?.name ||
        'Prestation inconnue',
    }));
  }

  async registerProviderApplication(providerDto: any): Promise<void> {
    const provider = await this.providerRepository.findOne({
      where: {
        user: { id: providerDto.providerId },
      },
      relations: ['services', 'certifications'],
    });

    if (!provider) {
      throw new NotFoundException(
        `Provider with ID ${providerDto.providerId} not found.`,
      );
    }

    provider.registryNumber = providerDto.siret;
    provider.mainActivity = providerDto.mainActivity;
    provider.yearsOfExperience = providerDto.yearsExperience;
    provider.activityDescription = providerDto.description;

    const services = providerDto.services.map((serviceDto: any) => {
      const service = new ServiceEntity();
      service.title = serviceDto.title;
      service.description = serviceDto.description;
      service.price = serviceDto.price;
      service.isNegotiable = serviceDto.negotiable || false;
      service.isAvailable = true;
      service.isMedical = false;
      service.realisationTime = 'Custom';
      service.provider = provider;
      return service;
    });

    const certifications = providerDto.documents.map((documentDto: any) => {
      const certification = new CertificationEntity();
      certification.title = documentDto.title;
      certification.description = documentDto.description;
      certification.industry = providerDto.mainActivity;
      certification.issuingAuthority = 'Unknown';
      certification.issueDate = new Date();
      certification.expiryDate = null;
      certification.documentUrl = documentDto.filePath;
      certification.isVerified = false;
      certification.provider = provider;
      return certification;
    });

    await this.dataSource.transaction(
      async (transactionalEntityManager: any) => {
        await transactionalEntityManager.save(provider);

        await transactionalEntityManager.save(services);
        await transactionalEntityManager.save(certifications);
      },
    );
  }

  async getServicesList(providerId: number): Promise<any[]> {
    const provider = await this.providerRepository.findOne({
      where: { user: { id: providerId } },
      relations: ['services'],
    });
    if (!provider) {
      throw new HttpException(
        `Provider ${providerId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return provider.services;
  }

  async deleteService(serviceId: number): Promise<void> {
    await this.dataSource.transaction(
      async (transactionalEntityManager: any) => {
        transactionalEntityManager.delete(ServiceEntity, { id: serviceId });
      },
    );
  }

  async updateProviderService(id: number, service: any): Promise<void> {
    await this.dataSource.transaction(
      async (transactionalEntityManager: any) => {
        transactionalEntityManager.update(ServiceEntity, { id: id }, service);
      },
    );
  }

  async createService(service: any, providerId: number): Promise<void> {
    const provider = await this.findProviderByUserId(providerId);

    const serviceEntity = new ServiceEntity();
    serviceEntity.title = service.title;
    serviceEntity.description = service.description;
    serviceEntity.price = service.price;
    serviceEntity.isNegotiable = service.negotiable || false;
    serviceEntity.isAvailable = true;
    serviceEntity.isMedical = false;
    serviceEntity.realisationTime = 'Custom';
    serviceEntity.provider = provider;
    await this.dataSource.transaction(
      async (transactionalEntityManager: any) => {
        transactionalEntityManager.insert(ServiceEntity, serviceEntity);
      },
    );
  }

  // provider.service.ts
  async getProviderBookings(providerId: number): Promise<any[]> {
    const provider = await this.providerRepository.findOne({
      where: { user: { id: providerId } },
      relations: [
        'bookings',
        'bookings.service',
        'bookings.employee',
        'bookings.employee.user', // if you need user details
      ],
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider.bookings.map((booking) => ({
      ...booking,
      serviceName: booking.service?.title,
      employeeName: booking.employee.lastName,
    }));
  }

  async updateBooking(id: number, action: any): Promise<void> {
    const booking = await this.bookingRepository.findOne({ where: { id: id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    switch (action.action) {
      case 'validate':
        booking.status = BookingStatus.COMPLETED;
        break;
      case 'cancel':
        booking.status = BookingStatus.CANCELLED_PROVIDER;
        break;
      case 'confirm':
        booking.status = BookingStatus.CONFIRMED;
        break;
    }
    await this.bookingRepository.save(booking);
  }

  async findProviderInvoices(providerId: number): Promise<any[]> {
    const provider = await this.providerRepository.findOne({
      where: { user: { id: providerId } },
      relations: ['invoices'],
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider.invoices;
  }
}
