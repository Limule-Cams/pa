import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { UserEntity } from '../../common/entity/user.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { ProviderEntity } from '../provider/provider.entity';
import { ServiceEntity } from '../../common/entity/service.entity';
import { CompanyListItemDto } from './dto/company-list-item.dto';
import { ProviderListItemDto } from './dto/provider-list-item.dto';
import { UpdateProviderValidationDto } from './dto/update-provider-validation.dto';
import { CreateUpdateServiceDto } from './dto/create-update-service.dto';
import { ServiceDetailsDto } from './dto/service-details.dto';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { CompanyStatus } from '../../common/enum/company-status.enum';
import { SubscriptionTier } from '../../common/enum/subscription-tier.enum';
import { CertificationEntity } from '../../common/entity/certification.entity';
import { NotificationService } from '../../core/notification/notification.service';
import { HashUtils } from '../../core/utils/hash.utils';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import {
  BookingEntity,
  BookingStatus,
} from '../../common/entity/booking.entity';
import { InvoiceStatus } from '../../common/enum/invoice-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { ReportEntity } from '../../common/entity/report.entity';
import { ReportStatus } from '../../common/enum/report-status.enum';
import { AdminReportDto } from './dto/admin-report.dto';
import { EventEntity } from '../../common/entity/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventListItemDto } from './dto/event-list-item.dto';
import { EventDetailsDto } from './dto/event-details.dto';
import { QuestionAnswerEntity } from '../../common/entity/question-answer.entity';
import { CreateQaDto } from './dto/create-qa.dto';
import { UpdateQaDto } from './dto/update-qa.dto';
import { QaListItemDto } from './dto/qa-list-item.dto';
import { QaDetailsDto } from './dto/qa-details.dto';
import { QuoteEntity } from '../../common/entity/quote.entity';
import { QuoteStatus } from '../../common/enum/quote-status.enum';
import { QuoteListItemDto } from './dto/quote-list-item.dto';
import { QuoteDetailsDto } from './dto/quote-details.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { ContractEntity } from '../../common/entity/contract.entity';
import { CreateContractFromQuoteDto } from './dto/create-contract-from-quote.dto';
import { ContractDto } from '../company/dto/contract.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { EmployeeEntity } from '../employee/employee.entity';
import { EmailService } from '../../core/utils/mailer.service';
import { DevisEntity } from '../../common/entity/devis.entity';

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProviderEntity)
    private readonly providerRepository: Repository<ProviderEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(CertificationEntity)
    private readonly certificationRepository: Repository<CertificationEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(QuestionAnswerEntity)
    private readonly qaRepository: Repository<QuestionAnswerEntity>,
    @InjectRepository(QuoteEntity)
    private readonly quoteRepository: Repository<QuoteEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    private readonly notificationService: NotificationService,
    private readonly hashUtils: HashUtils,
    private readonly mailerService: EmailService,
    @InjectRepository(DevisEntity)
    private readonly devisRepository: Repository<DevisEntity>,
  ) {}

  // --- Internal Helpers ---

  async createDevis(createDevisDto: any): Promise<any> {
    const devis = this.devisRepository.create({
      ...createDevisDto,
    });

    return await this.devisRepository.save(devis);
  }

  async findAllDevis(): Promise<any[]> {
    return await this.devisRepository.find();
  }

  async findOneDevis(id: number): Promise<any> {
    const devis = await this.devisRepository.findOne({
      where: { id: id },
    });
    if (!devis) {
      throw new Error('Devis not found');
    }
    return devis;
  }

  async updateDevis(id: number, updateDevisDto: any): Promise<any> {
    const devis = await this.devisRepository.preload({
      id,
      ...updateDevisDto,
    });
    if (!devis) {
      throw new Error('Devis not found');
    }
    return await this.devisRepository.save(devis);
  }

  async removeDevis(id: number): Promise<void> {
    const result = await this.devisRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Devis not found');
    }
  }


  // --- Company Management ---
  async findAllCompanies(): Promise<{
    data: CompanyListItemDto[];
    total: number;
  }> {
    try {
      const [companies, total] = await this.companyRepository.findAndCount({
        relations: ['user', 'employees'],
        order: { name: 'ASC' },
      });
      const data = companies.map((c) => ({
        id: c.id,
        name: c.name,
        registryNumber: c.registryNumber,
        city: c.city,
        status: c.status,
        subscriptionTier: c.subscriptionTier,
        employeeCount: Array.isArray(c.employees) ? c.employees.length : 0,
        creationDate: c.creationDate,
        userEmail: c.user?.email,
        phoneNumber: c.phoneNumber,
      }));
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Failed to find companies: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Could not retrieve company list.',
      );
    }
  }

  async findCompanyDetails(companyId: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: [
        'user',
        'employees',
        'contracts',
        'invoicesReceived',
        'events',
      ],
    });
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    return company;
  }

  async findAllEmployees(): Promise<any[]> {
    return await this.employeeRepository.find({
      relations: ['user'],
    });
  }

  async createCompany(createDto: CreateCompanyDto): Promise<void> {
    const companyAlreadyExists = await this.companyRepository.findOne({
      where: { name: createDto.name },
    });

    if (companyAlreadyExists) {
      throw new ConflictException('Cette entreprise existe déjà');
    }

    const hashedPassword = await this.hashUtils.hashPassword(
      createDto.user.password,
    );

    const user = this.userRepository.create({
      email: createDto.user.email,
      password: hashedPassword,
      isActive: createDto.user.isActive,
      role: createDto.user.role,
    });

    await this.userRepository.save(user);

    const companyEntity = this.companyRepository.create({
      name: createDto.name,
      registryNumber: createDto.registryNumber,
      address: createDto.address,
      city: createDto.city,
      creationDate: createDto.creationDate,
      founder: createDto.founder,
      industry: createDto.industry,
      phoneNumber: createDto.phoneNumber,
      user: user,
      size: createDto.size,
    });

    await this.companyRepository.save(companyEntity);
  }

  async updateCompany(
    companyId: number,
    updateData: DeepPartial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    this.logger.log(`Admin attempting to update company ID: ${companyId}`);
    const company = await this.companyRepository.findOneBy({ id: companyId });
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    const {
      id,
      user,
      creationDate,
      employees,
      contracts,
      invoicesReceived,
      events,
      ...allowedUpdates
    } = updateData;
    this.companyRepository.merge(company, allowedUpdates);
    try {
      await this.companyRepository.save(company);
      this.logger.log(`Company ${companyId} updated successfully.`);
      return this.findCompanyDetails(companyId);
    } catch (error) {
      this.logger.error(
        `Failed to update company ${companyId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async deleteCompany(companyId: number): Promise<void> {
    await this.companyRepository.delete(companyId);
  }

  async changeCompanyStatus(
    companyId: number,
    status: CompanyStatus,
  ): Promise<void> {
    this.logger.log(
      `Admin changing status for company ${companyId} to ${status}`,
    );
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['user'],
    });
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    if (company.status === status) {
      this.logger.warn(`Company ${companyId} already has status ${status}.`);
      return;
    }
    const previousStatus = company.status;
    company.status = status;
    try {
      await this.companyRepository.save(company);
      this.logger.log(
        `Company ${companyId} status changed from ${previousStatus} to ${status}.`,
      );
      // TODO: Notification à la compagnie
    } catch (error) {
      this.logger.error(
        `Failed to change status for company ${companyId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  // --- Provider Management ---
  async createProvider(providerDto: any): Promise<number> {
    const provider = await this.providerRepository.findOne({
      where: { fullName: providerDto.fullName },
    });
    console.log(providerDto);
    if (provider) {
      throw new ConflictException('Cette entreprise existe déjà');
    }

    const hashedPassword = await this.hashUtils.hashPassword(
      providerDto.user.password,
    );

    const user = this.userRepository.create({
      email: providerDto.user.email,
      password: hashedPassword,
      isActive: false,
      role: providerDto.user.role,
    });
    const newUser = await this.userRepository.save(user);

    const providerEntity = this.providerRepository.create({
      fullName: providerDto.fullName,
      referenceName: providerDto.referenceName,
      address: providerDto.address,
      phoneNumber: providerDto.phoneNumber,
      user: user,
    });

    await this.providerRepository.save(providerEntity);
    return newUser.id;
  }

  async findAllProviders(): Promise<{ data: any[]; total: number }> {
    const providersList = await this.providerRepository.find({
      relations: ['user', 'services', 'bookings', 'certifications'],
    });
    const count = providersList.length;
    return {
      data: providersList,
      total: count,
    };
  }

  async findProviderDetails(providerId: number): Promise<ProviderEntity> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
      relations: [
        'user',
        'services',
        'certifications',
        'invoices',
        'evaluationsReceived',
      ],
    });
    if (!provider) {
      throw new NotFoundException('PROVIDER_NOT_FOUND');
    }
    return provider;
  }

  async updateProviderValidation(
    providerId: number,
    validationDto: UpdateProviderValidationDto,
  ): Promise<ProviderListItemDto> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
      relations: ['user', 'certifications', 'services'],
    });
    if (!provider) {
      throw new NotFoundException('PROVIDER_NOT_FOUND');
    }
    const previousStatus = provider.validationStatus;
    const previousVerified = provider.isVerified;
    provider.validationStatus = validationDto.validationStatus;
    provider.isVerified = validationDto.isVerified;
    try {
      await this.providerRepository.save(provider);
      this.logger.log(
        `Provider ${providerId} validation updated to ${validationDto.validationStatus}, verified: ${validationDto.isVerified}.`,
      );
      if (provider.user) {
        await this.notificationService.sendProviderValidationUpdate(
          provider.user.id,
          provider.validationStatus,
          provider.isVerified,
        );
      }
      return {
        id: provider.id,
        userId: provider.user?.id,
        firstName: provider.firstName,
        lastName: provider.lastName,
        email: provider.user?.email,
        isAvailable: provider.isAvailable,
        isVerified: provider.isVerified,
        validationStatus: provider.validationStatus,
        rating: provider.rating,
        serviceCount: Array.isArray(provider.services)
          ? provider.services.length
          : 0,
        certificationCount: Array.isArray(provider.certifications)
          ? provider.certifications.length
          : 0,
        pendingCertificationCount: Array.isArray(provider.certifications)
          ? provider.certifications.filter((c) => !c.isVerified).length
          : 0,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update provider validation for ${providerId}: ${error.message}`,
        error.stack,
      );
      provider.validationStatus = previousStatus;
      provider.isVerified = previousVerified;
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async verifyCertification(
    certificationId: number,
    verified: boolean,
  ): Promise<void> {
    const certification = await this.certificationRepository.findOne({
      where: { id: certificationId },
      relations: ['provider', 'provider.user'],
    });
    if (!certification) {
      throw new NotFoundException('CERTIFICATION_NOT_FOUND');
    }
    certification.isVerified = verified;
    try {
      await this.certificationRepository.save(certification);
      this.logger.log(
        `Certification ${certificationId} verification status updated to ${verified}.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to verify certification ${certificationId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  // --- Service Catalog Management ---
  async findAllServices(
    options: {
      page?: number;
      limit?: number;
      category?: string;
      title?: string;
      providerId?: number | null;
      isAvailable?: boolean;
    } = {},
  ): Promise<{ data: ServiceDetailsDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      category,
      title,
      providerId,
      isAvailable,
    } = options;
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<ServiceEntity> = {};
    if (title) where.title = Like(`%${title}%`);
    if (providerId === null) {
      where.provider = IsNull();
    } else if (providerId) {
      where.provider = { id: providerId };
    }
    if (isAvailable !== undefined) where.isAvailable = isAvailable;
    try {
      const [services, total] = await this.serviceRepository.findAndCount({
        where,
        relations: ['provider', 'provider.user'],
        take: limit,
        skip: skip,
        order: { title: 'ASC' },
      });
      const data = services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        isAvailable: s.isAvailable,
        price: s.price,
        realisationTime: s.realisationTime,
        providerId: s.provider?.id ?? null,
        providerName: s.provider
          ? `${s.provider.firstName} ${s.provider.lastName}`
          : null,
        isMedical: s.isMedical,
      })); // Ajout isMedical
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Failed to find services: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async findServiceDetails(serviceId: number): Promise<ServiceDetailsDto> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider', 'provider.user'],
    });
    if (!service) {
      throw new NotFoundException('SERVICE_NOT_FOUND');
    }
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      isAvailable: service.isAvailable,
      price: service.price,
      realisationTime: service.realisationTime,
      providerId: service.provider?.id ?? null,
      providerName: service.provider
        ? `${service.provider.firstName} ${service.provider.lastName}`
        : null,
      isMedical: service.isMedical,
    }; // Ajout isMedical
  }

  async createService(
    createServiceDto: CreateUpdateServiceDto,
  ): Promise<ServiceDetailsDto> {
    this.logger.log(`Admin creating service: ${createServiceDto.title}`);
    const service = this.serviceRepository.create(createServiceDto);
    if (createServiceDto.providerId) {
      const provider = await this.providerRepository.findOneBy({
        id: createServiceDto.providerId,
      });
      if (!provider) throw new BadRequestException('PROVIDER_NOT_FOUND');
      service.provider = provider;
    } else {
      service.provider = null;
    }
    try {
      const savedService = await this.serviceRepository.save(service);
      this.logger.log(
        `Service "${savedService.title}" (ID: ${savedService.id}) created.`,
      );
      return this.findServiceDetails(savedService.id);
    } catch (error) {
      this.logger.error(
        `Failed to create service '${createServiceDto.title}': ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async updateService(
    serviceId: number,
    updateServiceDto: CreateUpdateServiceDto,
  ): Promise<ServiceDetailsDto> {
    this.logger.log(`Admin updating service ID: ${serviceId}`);
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['provider'],
    });
    if (!service) {
      throw new NotFoundException('SERVICE_NOT_FOUND');
    }
    const { providerId, ...updateData } = updateServiceDto;
    this.serviceRepository.merge(service, updateData);
    if (providerId === null) {
      service.provider = null;
    } else if (
      providerId !== undefined &&
      service.provider?.id !== providerId
    ) {
      const provider = await this.providerRepository.findOneBy({
        id: providerId,
      });
      if (!provider) throw new BadRequestException('PROVIDER_NOT_FOUND');
      service.provider = provider;
    }
    try {
      await this.serviceRepository.save(service);
      this.logger.log(`Service ${serviceId} updated successfully.`);
      return this.findServiceDetails(serviceId);
    } catch (error) {
      this.logger.error(
        `Failed to update service ${serviceId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async deleteService(serviceId: number): Promise<void> {
    this.logger.log(`Admin deleting service ID: ${serviceId}`);
    const result = await this.serviceRepository.delete(serviceId);
    if (result.affected === 0) {
      throw new NotFoundException('SERVICE_NOT_FOUND');
    }
    this.logger.log(`Service ${serviceId} deleted.`);
  }

  // --- Event Management ---
  async findAllEvents(): Promise<any[]> {

    return this.eventRepository.find({
      relations: ['employees', 'employees.company']
    })
  }

  async validateEvent(eventId: number): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId }
    });
    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }
    event.isActive = false;
    await this.eventRepository.save(event);
  }

  async findEventDetails(eventId: number): Promise<EventDetailsDto> {
    this.logger.log(`Workspaceing details for event ID: ${eventId}`);
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: [
        'company',
        'bookings',
        'bookings.employee',
        'bookings.employee.user',
      ],
    });
    if (!event) {
      throw new NotFoundException('EVENT_NOT_FOUND');
    }
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      capacity: event.capacity,
      isActive: event.isActive,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      companyId: event.company?.id ?? null,
      companyName: event.company?.name ?? null,
      bookings:
        event.bookings?.map((b) => ({
          id: b.id,
          bookingDate: b.bookingDate,
          status: b.status,
          employeeId: b.employee?.id,
          employeeName: b.employee
            ? `${b.employee.name} ${b.employee.lastName}`
            : 'N/A',
          employeeEmail: b.employee?.user?.email,
        })) || [],
    };
  }

  async createEvent(createEventDto: CreateEventDto): Promise<EventDetailsDto> {
    this.logger.log(`Admin creating event: ${createEventDto.name}`);

    const {
      startDate: startDateString,
      endDate: endDateString,
      companyId,
      ...eventData
    } = createEventDto;

    const startDate = this.parseDate(startDateString);
    const endDate = this.parseDate(endDateString);

    let company: CompanyEntity | null = null;
    if (companyId) {
      company = await this.companyRepository.findOneBy({ id: companyId });
      if (!company) {
        throw new BadRequestException('COMPANY_NOT_FOUND');
      }
    }

    const event = this.eventRepository.create({
      ...eventData,
      startDate,
      endDate,
      company,
    });

    try {
      const savedEvent = await this.eventRepository.save(event);
      this.logger.log(
        `Event "${savedEvent.name}" (ID: ${savedEvent.id}) created.`,
      );
      return this.findEventDetails(savedEvent.id);
    } catch (error) {
      this.logger.error(
        `Failed to create event: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async updateEvent(
    eventId: number,
    updateEventDto: UpdateEventDto,
  ): Promise<EventDetailsDto> {
    this.logger.log(`Admin updating event ID: ${eventId}`);

    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('EVENT_NOT_FOUND');
    }

    const {
      startDate: startDateString,
      endDate: endDateString,
      companyId,
      ...eventUpdateData
    } = updateEventDto;

    const updateData: Partial<EventEntity> = {
      ...eventUpdateData,
      startDate:
        startDateString !== undefined
          ? this.parseDate(startDateString)
          : event.startDate,
      endDate:
        endDateString !== undefined
          ? this.parseDate(endDateString)
          : event.endDate,
    };

    if (companyId === null) {
      updateData.company = null;
    } else if (companyId !== undefined) {
      const company = await this.companyRepository.findOneBy({ id: companyId });
      if (!company) {
        throw new BadRequestException('COMPANY_NOT_FOUND');
      }
      updateData.company = company;
    }

    this.eventRepository.merge(event, updateData);

    try {
      await this.eventRepository.save(event);
      this.logger.log(`Event ${eventId} updated successfully.`);
      return this.findEventDetails(eventId);
    } catch (error) {
      this.logger.error(
        `Failed to update event ${eventId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async deleteEvent(eventId: number): Promise<void> {
    this.eventRepository.delete(eventId);
  }

  // --- Financial Management ---
  async triggerProviderInvoiceGeneration(
    month: number,
    year: number,
  ): Promise<{
    generatedCount: number;
    totalAmount: number;
  }> {
    this.logger.log(
      `Starting provider invoice generation for month: ${month}, year: ${year}`,
    );
    if (month < 1 || month > 12) throw new BadRequestException('INVALID_MONTH');
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    const eligibleProviders = await this.providerRepository.find({
      where: {
        isVerified: true,
        validationStatus: ContractStatus.VERIFIED,
      },
      relations: ['user'],
    });
    if (eligibleProviders.length === 0) {
      this.logger.log(`No eligible providers for ${month}/${year}.`);
      return { generatedCount: 0, totalAmount: 0 };
    }
    const allInvoicesToSave: DeepPartial<InvoiceEntity>[] = [];
    let globalGeneratedCount = 0;
    let globalTotalAmountBilled = 0;
    const commissionRate = 0.15;
    for (const provider of eligibleProviders) {
      const existingInvoice = await this.invoiceRepository.findOne({
        where: {
          provider: { id: provider.id },
          invoiceDate: Between(startDate, endDate),
        },
      });
      if (existingInvoice) {
        this.logger.log(
          `Invoice exists for provider ${provider.id}. Skipping.`,
        );
        continue;
      }
      const completedBookings = await this.bookingRepository.find({
        where: {
          status: BookingStatus.COMPLETED,
          bookingDate: Between(startDate, endDate),
          service: { provider: { id: provider.id } },
        },
        relations: ['service'],
      });
      if (completedBookings.length === 0) {
        this.logger.log(
          `No completed bookings for provider ${provider.id}. Skipping.`,
        );
        continue;
      }
      const totalGrossAmount = completedBookings.reduce(
        (sum, booking) => sum + (booking.service?.price ?? 0),
        0,
      );
      const amountDueToProvider = totalGrossAmount * (1 - commissionRate);
      if (amountDueToProvider <= 0) {
        this.logger.log(
          `Amount due <= 0 for provider ${provider.id}. Skipping.`,
        );
        continue;
      }
      const invoiceData: DeepPartial<InvoiceEntity> = {
        invoiceNumber: `BC-PROV-${year}${String(month).padStart(2, '0')}-${provider.id}-${uuidv4().substring(0, 4)}`,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: InvoiceStatus.PENDING,
        provider: { id: provider.id },
        description: `Remuneration ${startDate.toLocaleString('fr-FR', {
          month: 'long',
          year: 'numeric',
        })} (${completedBookings.length} bookings). Gross: ${totalGrossAmount.toFixed(2)}€, Commission: ${(commissionRate * 100).toFixed(0)}%`,
        totalAmount: parseFloat(amountDueToProvider.toFixed(2)),
      };
      allInvoicesToSave.push(invoiceData);
      globalTotalAmountBilled += amountDueToProvider;
      globalGeneratedCount++;
      this.logger.log(
        `Prepared invoice ${invoiceData.invoiceNumber} for provider ${provider.id}, amount: ${invoiceData.totalAmount}`,
      );
    }
    if (allInvoicesToSave.length > 0) {
      this.logger.log(`Saving ${allInvoicesToSave.length} provider invoices.`);
      try {
        const savedInvoices =
          await this.invoiceRepository.save(allInvoicesToSave);
        this.logger.log(`${savedInvoices.length} provider invoices saved.`);
        const savedInvoicesWithRelations = await this.invoiceRepository.find({
          where: { id: In(savedInvoices.map((inv) => inv.id)) },
          relations: ['provider', 'provider.user'],
        });
        for (const invoice of savedInvoicesWithRelations) {
          if (invoice.provider?.user?.id) {
            try {
              await this.notificationService.sendNewProviderInvoice(
                invoice.provider.user.id,
                invoice,
              );
            } catch (notificationError) {
              this.logger.error(
                `Notify error for invoice ${invoice.id}: ${notificationError.message}`,
              );
            }
          } else {
            this.logger.warn(
              `Cannot notify for invoice ${invoice.id}: missing provider user info.`,
            );
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to save provider invoices: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
      }
    } else {
      this.logger.log(
        `No new provider invoices generated for ${month}/${year}.`,
      );
    }
    return {
      generatedCount: globalGeneratedCount,
      totalAmount: parseFloat(globalTotalAmountBilled.toFixed(2)),
    };
  }

  async getFinancialSummary(): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    clientInvoiceCount: number;
    providerInvoiceCount: number;
  }> {
    this.logger.log('Calculating financial summary.');
    try {
      const clientInvoices = await this.invoiceRepository.find({
        where: { company: Not(IsNull()) },
      });
      const providerInvoices = await this.invoiceRepository.find({
        where: { provider: Not(IsNull()) },
      });
      const totalRevenue = clientInvoices.reduce(
        (sum, inv) => sum + inv.totalAmount,
        0,
      );
      const totalExpenses = providerInvoices.reduce(
        (sum, inv) => sum + inv.totalAmount,
        0,
      );
      const netProfit = totalRevenue - totalExpenses;
      const summary = {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netProfit: parseFloat(netProfit.toFixed(2)),
        clientInvoiceCount: clientInvoices.length,
        providerInvoiceCount: providerInvoices.length,
      };
      this.logger.log(
        `Financial Summary: Revenue=${summary.totalRevenue}, Expenses=${summary.totalExpenses}, Net=${summary.netProfit}`,
      );
      return summary;
    } catch (error) {
      this.logger.error(
        `Failed to get financial summary: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  // --- Signalements Anonymes ---
  async getAnonymousReports(
    options: {
      page?: number;
      limit?: number;
      status?: ReportStatus;
      category?: string;
    } = {},
  ): Promise<{ data: AdminReportDto[]; total: number }> {
    this.logger.log(
      `Admin fetching anonymous reports with options: ${JSON.stringify(options)}`,
    );
    const { page = 1, limit = 20, status, category } = options;
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<ReportEntity> = {};
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = Like(`%${category}%`);
    }
    try {
      const [reports, total] = await this.reportRepository.findAndCount({
        where,
        take: limit,
        skip: skip,
        order: { reportedAt: 'DESC' },
      });
      const data = reports.map((report) => ({
        id: report.id,
        reportedAt: report.reportedAt,
        status: report.status,
        category: report.category,
        contentPreview:
          report.content.substring(0, 100) +
          (report.content.length > 100 ? '...' : ''),
      }));
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve reports: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async getAnonymousReportDetails(reportId: number): Promise<ReportEntity> {
    const report = await this.reportRepository.findOneBy({ id: reportId });
    if (!report) {
      throw new NotFoundException('REPORT_NOT_FOUND');
    }
    return report;
  }

  async updateReportStatus(
    reportId: number,
    status: ReportStatus,
  ): Promise<void> {
    this.logger.log(
      `Admin updating status for report ${reportId} to ${status}`,
    );
    const report = await this.reportRepository.findOneBy({ id: reportId });
    if (!report) {
      throw new NotFoundException('REPORT_NOT_FOUND');
    }
    report.status = status;
    try {
      await this.reportRepository.save(report);
      this.logger.log(`Report ${reportId} status updated to ${status}.`);
    } catch (error) {
      this.logger.error(
        `Failed to update report status ${reportId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  // --- Chatbot Q/A Management ---
  async findAllQA(
    options: {
      page?: number;
      limit?: number;
      isActive?: boolean;
      query?: string;
    } = {},
  ): Promise<{
    data: QaListItemDto[];
    total: number;
  }> {
    this.logger.log(
      `Admin fetching chatbot Q/A with options: ${JSON.stringify(options)}`,
    );
    const { page = 1, limit = 20, isActive, query } = options;
    const skip = (page - 1) * limit;
    let where:
      | FindOptionsWhere<QuestionAnswerEntity>
      | FindOptionsWhere<QuestionAnswerEntity>[] = {};
    const baseWhere: FindOptionsWhere<QuestionAnswerEntity> = {};
    if (isActive !== undefined) {
      baseWhere.isActive = isActive;
    }
    if (query) {
      where = [
        { ...baseWhere, question: Like(`%${query}%`) },
        { ...baseWhere, keywords: Like(`%${query}%`) },
      ];
    } else if (Object.keys(baseWhere).length > 0) {
      where = baseWhere;
    } else {
      where = {};
    }
    try {
      const [qas, total] = await this.qaRepository.findAndCount({
        where: Array.isArray(where)
          ? where
          : Object.keys(where).length > 0
            ? where
            : undefined,
        take: limit,
        skip: skip,
        order: { priority: 'DESC', updatedAt: 'DESC' },
      });
      const data = qas.map((qa) => ({
        id: qa.id,
        question:
          qa.question.substring(0, 150) +
          (qa.question.length > 150 ? '...' : ''),
        isActive: qa.isActive,
        priority: qa.priority,
        updatedAt: qa.updatedAt,
      }));
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Failed to find Q/A entries: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async findQADetails(id: number): Promise<QaDetailsDto> {
    this.logger.log(`Workspaceing details for Q/A ID: ${id}`);
    const qa = await this.qaRepository.findOneBy({ id });
    if (!qa) {
      throw new NotFoundException('QA_NOT_FOUND');
    }
    return {
      id: qa.id,
      question: qa.question,
      keywords: qa.keywords,
      answer: qa.answer,
      isActive: qa.isActive,
      priority: qa.priority,
      createdAt: qa.createdAt,
      updatedAt: qa.updatedAt,
    };
  }

  async createQA(createQaDto: CreateQaDto): Promise<QaDetailsDto> {
    this.logger.log(
      `Admin creating new Q/A: "${createQaDto.question.substring(0, 50)}..."`,
    );
    try {
      const qa = this.qaRepository.create(createQaDto);
      const savedQa = await this.qaRepository.save(qa);
      this.logger.log(`Q/A entry created with ID: ${savedQa.id}`);
      return this.findQADetails(savedQa.id);
    } catch (error) {
      this.logger.error(
        `Failed to create Q/A entry: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async updateQA(id: number, updateQaDto: UpdateQaDto): Promise<QaDetailsDto> {
    this.logger.log(`Admin updating Q/A ID: ${id}`);
    const qa = await this.qaRepository.findOneBy({ id });
    if (!qa) {
      throw new NotFoundException('QA_NOT_FOUND');
    }
    this.qaRepository.merge(qa, updateQaDto);
    try {
      await this.qaRepository.save(qa);
      this.logger.log(`Q/A entry ${id} updated successfully.`);
      return this.findQADetails(id);
    } catch (error) {
      this.logger.error(
        `Failed to update Q/A entry ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async deleteQA(id: number): Promise<void> {
    this.logger.log(`Admin deleting Q/A ID: ${id}`);
    const result = await this.qaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('QA_NOT_FOUND');
    }
    this.logger.log(`Q/A entry ${id} deleted successfully.`);
  }

  // --- Quote Management (Admin) ---
  async findAllQuotes(
    options: {
      page?: number;
      limit?: number;
      status?: QuoteStatus;
      companyId?: number;
      query?: string;
    } = {},
  ): Promise<{ data: QuoteListItemDto[]; total: number }> {
    this.logger.log(
      `Admin fetching quotes with options: ${JSON.stringify(options)}`,
    );
    const { page = 1, limit = 10, status, companyId, query } = options;
    const skip = (page - 1) * limit;
    let where: FindOptionsWhere<QuoteEntity> | FindOptionsWhere<QuoteEntity>[] =
      {};
    const baseWhere: FindOptionsWhere<QuoteEntity> = {};
    if (status) {
      baseWhere.status = status;
    }
    if (companyId) {
      baseWhere.company = { id: companyId };
    }
    if (query) {
      where = [
        { ...baseWhere, quoteNumber: Like(`%${query}%`) },
        {
          ...baseWhere,
          company: { name: Like(`%${query}%`) },
        },
        { ...baseWhere, contactEmail: Like(`%${query}%`) },
      ];
    } else if (Object.keys(baseWhere).length > 0) {
      where = baseWhere;
    } else {
      where = {};
    }
    try {
      const [quotes, total] = await this.quoteRepository.findAndCount({
        where: Array.isArray(where)
          ? where
          : Object.keys(where).length > 0
            ? where
            : undefined,
        relations: ['company', 'company.user'],
        take: limit,
        skip: skip,
        order: { createdAt: 'DESC' },
      });
      const data = quotes.map((q) => ({
        id: q.id,
        quoteNumber: q.quoteNumber,
        companyName: q.company?.name ?? q.contactName ?? 'N/A',
        contactEmail: q.company?.user?.email ?? q.contactEmail ?? 'N/A',
        numberOfEmployees: q.numberOfEmployees,
        estimatedAnnualTotal: q.estimatedAnnualTotal,
        status: q.status,
        createdAt: q.createdAt,
        validUntil: q.validUntil,
      }));
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to find quotes: ${error.message}`, error.stack);
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async findQuoteDetails(id: number): Promise<QuoteDetailsDto> {
    this.logger.log(`Workspaceing details for Quote ID: ${id}`);
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['company', 'company.user', 'linkedContract'],
    });
    if (!quote) {
      throw new NotFoundException('QUOTE_NOT_FOUND');
    }
    return {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      companyId: quote.company?.id ?? null,
      companyName: quote.company?.name ?? null,
      contactName: quote.contactName,
      contactEmail: quote.company?.user?.email ?? quote.contactEmail,
      numberOfEmployees: quote.numberOfEmployees,
      calculatedTier: quote.calculatedTier,
      requestedTier: quote.requestedTier,
      annualPricePerEmployee: quote.annualPricePerEmployee,
      estimatedAnnualTotal: quote.estimatedAnnualTotal,
      details: quote.details,
      status: quote.status,
      validUntil: quote.validUntil,
      linkedContractId: quote.linkedContract?.id ?? null,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
    };
  }

  async updateQuoteStatus(
    id: number,
    updateDto: UpdateQuoteStatusDto,
  ): Promise<QuoteDetailsDto> {
    this.logger.log(
      `Admin updating Quote ID ${id} status to ${updateDto.status}`,
    );
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['company', 'company.user'],
    });
    if (!quote) {
      throw new NotFoundException('QUOTE_NOT_FOUND');
    }
    const previousStatus = quote.status;
    quote.status = updateDto.status;
    if (updateDto.validUntil) {
      const date = new Date(updateDto.validUntil);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('INVALID_DATE');
      }
      quote.validUntil = date;
    }
    if (updateDto.linkedContractId !== undefined) {
      quote.linkedContract = updateDto.linkedContractId
        ? ({ id: updateDto.linkedContractId } as ContractEntity)
        : null;
    }
    try {
      await this.quoteRepository.save(quote);
      this.logger.log(
        `Quote entry ${id} status updated to ${updateDto.status}.`,
      );
      if (
        quote.company?.user &&
        quote.status !== previousStatus &&
        [
          QuoteStatus.SENT,
          QuoteStatus.REJECTED,
          QuoteStatus.EXPIRED,
          QuoteStatus.CONTRACTED,
        ].includes(quote.status)
      ) {
        let notifTitle = 'Mise à jour de votre devis';
        let notifMessage = `Le statut de votre devis ${quote.quoteNumber} est maintenant : ${quote.status}.`;
        if (quote.status === QuoteStatus.SENT)
          notifMessage = `Votre devis ${quote.quoteNumber} est prêt.`;
        if (quote.status === QuoteStatus.CONTRACTED)
          notifMessage = `Votre devis ${quote.quoteNumber} a été transformé en contrat.`;
        await this.notificationService.sendNotification(
          quote.company.user.id,
          notifTitle,
          notifMessage,
        );
      }
      return this.findQuoteDetails(id);
    } catch (error) {
      this.logger.error(
        `Failed to update quote entry ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async deleteQuote(id: number): Promise<void> {
    this.logger.log(`Admin deleting Quote ID: ${id}`);
    const result = await this.quoteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('QUOTE_NOT_FOUND');
    }
    this.logger.log(`Quote entry ${id} deleted successfully.`);
  }

  async createContractFromQuote(
    dto: CreateContractFromQuoteDto,
  ): Promise<ContractDto> {
    this.logger.log(`Admin creating contract from quote ID: ${dto.quoteId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const quote = await this.quoteRepository.findOne({
        where: { id: dto.quoteId },
        relations: ['company', 'company.user', 'linkedContract'],
      });

      if (!quote) {
        throw new NotFoundException('QUOTE_NOT_FOUND');
      }

      if (!quote.company) {
        throw new BadRequestException('QUOTE_NOT_LINKED_TO_COMPANY');
      }

      if (quote.status !== QuoteStatus.ACCEPTED) {
        throw new BadRequestException('QUOTE_NOT_ACCEPTED');
      }

      if (quote.linkedContract) {
        throw new BadRequestException('CONTRACT_ALREADY_EXISTS_FOR_QUOTE');
      }

      const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
      const endDate = dto.endDate
        ? new Date(dto.endDate)
        : new Date(
            startDate.getFullYear() + 1,
            startDate.getMonth(),
            startDate.getDate(),
          );

      if (
        isNaN(startDate.getTime()) ||
        (dto.endDate && isNaN(endDate.getTime())) ||
        (endDate && endDate <= startDate)
      ) {
        throw new BadRequestException('INVALID_CONTRACT_DATES');
      }

      const newContract = queryRunner.manager.create(ContractEntity, {
        company: quote.company,
        originatingQuote: quote,
        startDate: startDate,
        endDate: endDate,
        status: ContractStatus.PENDING,
        renewable: true,
        conditions:
          dto.conditions ||
          `Standard conditions based on quote ${quote.quoteNumber} (${quote.calculatedTier}).`,
        fileUrl: dto.fileUrl !== undefined ? dto.fileUrl : undefined, // Crucial change!
      });

      const savedContract = await queryRunner.manager.save(
        ContractEntity,
        newContract,
      );

      quote.status = QuoteStatus.CONTRACTED;
      quote.linkedContract = savedContract;
      await queryRunner.manager.save(quote);

      if (quote.company.subscriptionTier !== quote.calculatedTier) {
        quote.company.subscriptionTier = quote.calculatedTier;
        await queryRunner.manager.save(quote.company);
      }

      await queryRunner.commitTransaction();

      if (quote.company.user) {
        await this.notificationService.sendNotification(
          quote.company.user.id,
          'Your contract is ready',
          `Contract N°${savedContract.id} based on quote ${quote.quoteNumber} has been created.`,
        );
      }

      return {
        id: savedContract.id,
        startDate: savedContract.startDate,
        endDate: savedContract.endDate,
        status: savedContract.status,
        renewable: savedContract.renewable,
        conditions: savedContract.conditions,
        fileUrl: savedContract.fileUrl,
        companyId: quote.company.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to create contract from quote ${dto.quoteId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    } finally {
      await queryRunner.release();
    }
  }

  // --- Placeholder Methods ---
  async getClientInvoices(companyId?: number): Promise<any[]> {
    this.logger.warn('getClientInvoices needs implementation.');
    return [];
  }

  async getProviderInvoicesAdmin(providerId?: number): Promise<any[]> {
    this.logger.warn('getProviderInvoicesAdmin needs implementation.');
    return [];
  }

  async getAllBookings(options?: any): Promise<any[]> {
    this.logger.warn(
      'getAllBookings needs implementation (with anonymization).',
    );
    return [];
  }

  async getAllEvaluations(options?: any): Promise<any[]> {
    this.logger.warn('getAllEvaluations needs implementation.');
    return [];
  }

  private parseDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`Invalid date format: ${dateString}`);
    }
    return parsedDate;
  }

  private getTierForEmployeeCount(employeeCount: number): SubscriptionTier {
    if (employeeCount <= 0) return SubscriptionTier.STARTER;
    if (employeeCount <= 30) return SubscriptionTier.STARTER;
    if (employeeCount <= 250) return SubscriptionTier.BASIC;
    return SubscriptionTier.PREMIUM;
  }

  private getRatePerEmployee(tier: SubscriptionTier): number {
    switch (tier) {
      case SubscriptionTier.STARTER:
        return 180;
      case SubscriptionTier.BASIC:
        return 150;
      case SubscriptionTier.PREMIUM:
        return 100;
      case SubscriptionTier.CUSTOM:
        return 0;
      default:
        this.logger.warn(
          `Unhandled subscription tier in getRatePerEmployee: ${tier}.`,
        );
        return 180;
    }
  }

  private getTierLimits(tier: SubscriptionTier | null): {
    activities: number;
    medicalRDV: number;
    chatbotQuestions: number | 'illimité';
    customAdvice: boolean;
    rdvCost: number;
  } {
    const safeTier = tier ?? SubscriptionTier.STARTER;
    switch (safeTier) {
      case SubscriptionTier.STARTER:
        return {
          activities: 2,
          medicalRDV: 1,
          chatbotQuestions: 6,
          customAdvice: false,
          rdvCost: 75,
        };
      case SubscriptionTier.BASIC:
        return {
          activities: 3,
          medicalRDV: 2,
          chatbotQuestions: 20,
          customAdvice: false,
          rdvCost: 75,
        };
      case SubscriptionTier.PREMIUM:
        return {
          activities: 4,
          medicalRDV: 3,
          chatbotQuestions: 'illimité',
          customAdvice: true,
          rdvCost: 50,
        };
      case SubscriptionTier.CUSTOM:
        return {
          activities: 99,
          medicalRDV: 99,
          chatbotQuestions: 'illimité',
          customAdvice: true,
          rdvCost: 50,
        };
      default:
        this.logger.warn(
          `Unhandled subscription tier in getTierLimits: ${safeTier}.`,
        );
        return {
          activities: 0,
          medicalRDV: 0,
          chatbotQuestions: 0,
          customAdvice: false,
          rdvCost: 75,
        };
    }
  }

  async activateProviderAccount(providerId: number): Promise<void> {
    const provider = await this.providerRepository.findOne({
      where: { user: { id: providerId } },
      relations: ['user'],
    });
    if (!provider) {
      throw new NotFoundException('provider not found');
    }
    provider.user.isActive = true;
    await this.providerRepository.save(provider);
    await this.userRepository.save(provider.user);

    await this.mailerService.sendHtmlMail(
      provider.user.email,
      'Activation de votre compte prestataire',
      `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 20px;
      }
      
    
      
    </style>
  </head>
  <body>
    <div class="header">Activation de votre compte</div>
    
    <p>Cher(e) Prestataire,</p>
    
    <p>Nous avons le plaisir de vous informer que votre compte a été activé avec succès sur notre plateforme.</p>
    
    <p>Vous pouvez dès maintenant accéder à votre espace personnel </p>
     
    <p>Pour toute question ou assistance, notre équipe reste à votre disposition.</p>
          <p>Nous vous remercions pour votre confiance, nous sommes ravis de vous compter parmi nos prestataires et vous souhaitons une excellente expérience sur notre plateforme.</p>
      <p>Cordialement,<br>L'équipe CARESYNC</p>
      
    
  </body>
  </html>
  `
    );
  }
}
