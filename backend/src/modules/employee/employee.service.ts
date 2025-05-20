import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { UserEntity } from '../../common/entity/user.entity';
import { ServiceEntity } from '../../common/entity/service.entity';
import {
  BookingEntity,
  BookingStatus,
} from '../../common/entity/booking.entity';
import { ReportDto } from './dto/report.dto';
import { AdviceDto } from './dto/advice.dto';
import { AssociationDto } from './dto/association.dto';
import { CompanyEntity } from '../company/entities/company.entity';
import { EventEntity } from '../../common/entity/event.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { SlotStatus } from '../../common/enum/slot-status.enum';
import { NotificationService } from '../../core/notification/notification.service';
import { CompanyStatus } from '../../common/enum/company-status.enum';
import { AdviceEntity } from '../../common/entity/advice.entity';
import { AssociationEntity } from '../../common/entity/association.entity';
import { DonationEntity } from '../../common/entity/donation.entity';
import { VolunteeringActivityEntity } from '../../common/entity/volunteering-activity.entity';
import { VolunteerRegistrationEntity } from '../../common/entity/volunteer-registration.entity';
import { MakeDonationDto } from './dto/make-donation.dto';
import { RegisterVolunteerDto } from './dto/register-volunteer.dto';
import { ReportEntity } from '../../common/entity/report.entity';
import { ReportStatus } from '../../common/enum/report-status.enum';
import { ProviderEntity } from '../provider/provider.entity';
import { PostEntity } from '../../common/entity/post.entity';
import { CommentEntity } from '../../common/entity/comment.entity';
import { MessageEntity } from '../../common/entity/message.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(AvailabilitySlotEntity)
    private readonly availabilitySlotRepository: Repository<AvailabilitySlotEntity>,
    @InjectRepository(AdviceEntity)
    private readonly adviceRepository: Repository<AdviceEntity>,
    @InjectRepository(AssociationEntity)
    private readonly associationRepository: Repository<AssociationEntity>,
    @InjectRepository(DonationEntity)
    private readonly donationRepository: Repository<DonationEntity>,
    @InjectRepository(VolunteeringActivityEntity)
    private readonly volunteeringActivityRepository: Repository<VolunteeringActivityEntity>,
    @InjectRepository(VolunteerRegistrationEntity)
    private readonly volunteerRegistrationRepository: Repository<VolunteerRegistrationEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly notificationService: NotificationService,
    @InjectRepository(ProviderEntity)
    private readonly providerRepository: Repository<ProviderEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
  ) {}

  // --- Helpers ---
  async findEmployeeByUserId(userId: number): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: userId } },
      relations: ['company', 'user', 'events', 'bookings', 'bookings.service'],
    });
    if (!employee) {
      throw new ForbiddenException('EMPLOYEE_NOT_FOUND');
    }
    if (!employee.user || !employee.user.isActive) {
      throw new ForbiddenException('INACTIVE_ACCOUNT');
    }
    if (employee.endDate && employee.endDate <= new Date()) {
      throw new ForbiddenException('INACTIVE_EMPLOYEE_PROFILE');
    }
    if (!employee.company) {
      this.logger.error(`Employee ${employee.id} missing company link.`);
      throw new ForbiddenException('DATA_INCONSISTENCY');
    }
    const company = await this.companyRepository.findOneBy({
      id: employee.company.id,
    });
    if (!company || company.status !== CompanyStatus.ACTIVE) {
      throw new ForbiddenException('INACTIVE_COMPANY');
    }
    employee.company = company;
    return employee;
  }

  // --- Méthodes Publiques ---
  async getProfile(userId: number): Promise<any> {
    const employee = await this.findEmployeeByUserId(userId);
    return {
      employeeId: employee.id,
      userId: employee.user.id,
      email: employee.user.email,
      firstName: employee.name,
      lastName: employee.lastName,
      address: employee.address,
      occupied_job: employee.occupied_job,
      companyId: employee.company.id,
      companyName: employee.company.name,
      companyStatus: employee.company.status,
      companySubscriptionTier: employee.company.subscriptionTier,
      employeeContractType: employee.contractType,
      employeeStartDate: employee.startingDate,
      employeeEndDate: employee.endDate,
      events: employee.events,
      bookings: employee.bookings,
    };
  }

  async getAvailableServices(): Promise<any[]> {
    return await this.serviceRepository.find({
      relations: ['provider', 'provider.user'],
    });
  }

  async createBooking(bookingDto: any): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id: bookingDto.serviceId },
    });

    const employee = await this.employeeRepository.findOne({
      where: { user: { id: bookingDto.employeeId } },
    });

    if (!employee) {
      throw new ForbiddenException('EMPLOYEE_NOT_FOUND');
    }
    if (!service) {
      throw new ForbiddenException('SERVICE_NOT_FOUND');
    }
    const bookingEntity = this.bookingRepository.create({
      bookingDate: bookingDto.bookingDate,
      provider: { id: bookingDto.providerId },
      employee: employee,
      service: service,
      status: BookingStatus.CONFIRMED,
    });
    await this.bookingRepository.save(bookingEntity);
  }

  async getSchedule(providerId: number): Promise<any[]> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
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

  async cancelBooking(userId: number, bookingId: number): Promise<void> {
    const employee = await this.findEmployeeByUserId(userId);
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['service', 'service.provider', 'event'],
    });

    if (!booking) {
      throw new NotFoundException('BOOKING_NOT_FOUND');
    }

    const now = new Date();
    if (booking.bookingDate <= now) {
      throw new BadRequestException('CANNOT_CANCEL_PAST_BOOKING');
    }
    if (
      booking.status === BookingStatus.CANCELLED_EMPLOYEE ||
      booking.status === BookingStatus.CANCELLED_PROVIDER
    ) {
      throw new BadRequestException('BOOKING_ALREADY_CANCELLED');
    }

    booking.status = BookingStatus.CANCELLED_EMPLOYEE;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(BookingEntity, booking);

      if (booking.service?.provider) {
        this.logger.log(
          `Booking ${bookingId} is for a service with provider ${booking.service.provider.id}. Attempting to free slot.`,
        );
        const slot = await queryRunner.manager.findOne(AvailabilitySlotEntity, {
          where: { bookingId: booking.id },
        });

        if (slot) {
          if (slot.status === SlotStatus.BOOKED) {
            slot.status = SlotStatus.AVAILABLE;
            slot.bookingId = null;
            await queryRunner.manager.save(AvailabilitySlotEntity, slot);
            this.logger.log(
              `Availability slot ${slot.id} set back to AVAILABLE for cancelled booking ${bookingId}`,
            );
          } else {
            this.logger.warn(
              `Slot ${slot.id} associated with booking ${bookingId} was not in BOOKED status (was ${slot.status}). Not changing status.`,
            );
          }
        } else {
          this.logger.warn(
            `No AvailabilitySlotEntity found with bookingId ${bookingId} to free up.`,
          );
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Booking ${bookingId} cancelled by employee ${userId}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to cancel booking ${bookingId} by employee ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('CANCEL_BOOKING_FAILED');
    } finally {
      await queryRunner.release();
    }
  }

  async submitAnonymousReport(
    reportDto: ReportDto,
  ): Promise<{ success: boolean }> {
    this.logger.log(`Received anonymous report.`);
    if (!reportDto.content || reportDto.content.trim().length < 10) {
      throw new BadRequestException('REPORT_CONTENT_TOO_SHORT');
    }
    try {
      const report = this.reportRepository.create({
        content: reportDto.content,
        reportedAt: new Date(),
        status: ReportStatus.NEW,
      });
      await this.reportRepository.save(report);
      this.logger.log(`Anonymous report saved: ${report.id}`);
      await this.notificationService.sendNotification(
        'admin_group_tag',
        'Nouveau signalement anonyme',
        `Signalement ID: ${report.id} reçu.`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed save report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async createAdvice(adviceDto: any): Promise<void> {
    const adviceEntity = this.adviceRepository.create({
      title: adviceDto.title,
      summary: adviceDto.summary,
    });
    await this.adviceRepository.save(adviceEntity);
  }

  async getAdviceList(): Promise<AdviceDto[]> {
    this.logger.log('Fetching advice list.');
    try {
      const adviceEntities = await this.adviceRepository.find({
        where: { isActive: true },
        order: { publicationDate: 'DESC' },
      });
      return adviceEntities.map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        category: a.category,
        contentUrl: a.contentUrl,
        publicationDate: a.publicationDate,
      }));
    } catch (error) {
      this.logger.error(`Failed fetch advice: ${error.message}`, error.stack);
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  // --- Associations / Dons / Bénévolat ---
  async getAssociationList(): Promise<AssociationDto[]> {
    this.logger.log('Fetching association list.');
    try {
      const associations = await this.associationRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
      return associations.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        website: a.website,
        logoUrl: a.logoUrl,
      }));
    } catch (error) {
      this.logger.error(
        `Failed fetch associations: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async handleDonation(
    userId: number,
    donationData: MakeDonationDto,
  ): Promise<{ success: boolean; message: string; donationId?: number }> {
    const employee = await this.findEmployeeByUserId(userId);
    const association = await this.associationRepository.findOneBy({
      id: donationData.associationId,
      isActive: true,
    });
    if (!association) {
      throw new NotFoundException('ASSOCIATION_NOT_FOUND');
    }
    try {
      const donation = this.donationRepository.create({
        employee,
        association,
        type: donationData.type,
        amount: donationData.amount,
        description: donationData.description,
        donationDate: new Date(),
      });
      const savedDonation = await this.donationRepository.save(donation);
      this.logger.log(`Donation ${savedDonation.id} recorded.`);
      return {
        success: true,
        message: `Donation registered.`,
        donationId: savedDonation.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed record donation: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async handleVolunteering(
    userId: number,
    volunteeringData: RegisterVolunteerDto,
  ): Promise<{ success: boolean; message: string; registrationId?: number }> {
    const employee = await this.findEmployeeByUserId(userId);
    const activity = await this.volunteeringActivityRepository.findOneBy({
      id: volunteeringData.activityId,
      isActive: true,
    });
    if (!activity) {
      throw new NotFoundException('ACTIVITY_NOT_FOUND');
    }
    const existing = await this.volunteerRegistrationRepository.findOneBy({
      employee: { id: employee.id },
      activity: { id: activity.id },
    });
    if (existing) {
      throw new BadRequestException('ALREADY_REGISTERED');
    }
    try {
      const registration = this.volunteerRegistrationRepository.create({
        employee,
        activity,
        registrationDate: new Date(),
      });
      const saved =
        await this.volunteerRegistrationRepository.save(registration);
      this.logger.log(`Volunteer registration ${saved.id} recorded.`);
      return {
        success: true,
        message: `Registered for activity.`,
        registrationId: saved.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed volunteer registration: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  async getCommunityPosts(): Promise<any[]> {
    return this.postRepository.find({
      relations: ['author', 'comments', 'author.company', 'comments.author'],
    });
  }

  async createCommunityPost(postData: any): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: postData.employeeId } },
      relations: ['user'],
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const post = this.postRepository.create({
      content: postData.content,
      author: employee, // Directly assign the employee entity
    });

    await this.postRepository.save(post);
  }

  async getEventsList(): Promise<any[]> {
    return await this.eventRepository.find({
      relations: ['employees'],
    });
  }

  async eventParticipate(eventId: number, employeeId: number): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, isActive: true },
      relations: ['employees'],
    });

    if (!event) {
      throw new NotFoundException('Event not found or not active');
    }

    const employee = await this.employeeRepository.findOneBy({
      user: { id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (event.capacity && event.employees.length >= event.capacity) {
      throw new ConflictException('Event has reached maximum capacity');
    }

    const isAlreadyRegistered = event.employees.some(
      (e) => e.id === employeeId,
    );
    if (isAlreadyRegistered) {
      throw new ConflictException(
        'Employee is already registered for this event',
      );
    }

    event.employees.push(employee);
    await this.eventRepository.save(event);
  }

  async createComment(commentDto: any): Promise<any> {
    const author = await this.employeeRepository.findOne({
      where: { user: { id: commentDto.author } },
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    const post = await this.postRepository.findOne({
      where: { id: commentDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const commentEntity = this.commentRepository.create({
      content: commentDto.content,
      post: post,
      author: author,
    });
    await this.commentRepository.save(commentEntity);
  }

  async getChatMessages(): Promise<any[]> {
    return await this.messageRepository.find({
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async createMessage(messageDto: any): Promise<any> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: messageDto.userId } },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const message = this.messageRepository.create({
      content: messageDto.content,
      sender: employee,
    });
    await this.messageRepository.save(message);
  }

  async setEvaluation(
    providerId: number,
    employeeId: number,
    isLike: boolean,
  ): Promise<void> {
    // First, verify the employee exists
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: employeeId } },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    let evaluation = await this.evaluationRepository.findOne({
      where: {
        provider: { id: providerId },
        ratedByEmployee: { user: { id: employeeId } },
      },
    });

    if (evaluation) {
      evaluation.isLike = isLike;
    } else {
      evaluation = this.evaluationRepository.create({
        providerId: providerId,
        ratedByEmployee: employee,
        isLike,
      });
    }

    await this.evaluationRepository.save(evaluation);
    await this.updateProviderRating(providerId);
  }

  private async updateProviderRating(providerId: number): Promise<void> {
    const likeCountQuery = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .select('COUNT(*)', 'total')
      .addSelect('SUM(CASE WHEN evaluation.isLike = true THEN 1 ELSE 0 END)', 'likes')
      .where('evaluation.providerId = :providerId', { providerId })
      .getRawOne();


    const total = parseInt(likeCountQuery.total) || 0;
    const likes = parseInt(likeCountQuery.likes) || 0;

    const rating = total > 0 ? (likes / total) * 5 : 0;

    await this.providerRepository.update(providerId, {
      rating: parseFloat(rating.toFixed(1)), // Round to 1 decimal place
    });
  }

  async getEmployeeEvaluation(
    providerId: number,
    employeeId: number,
  ): Promise<any | null> {
    const e = await this.evaluationRepository.findOne({
      where: {
        provider: { id: providerId },
        ratedByEmployee: { user: { id: employeeId } },
      },
      relations: ['ratedByEmployee']
    });
    console.log(e)
    return e
  }
}