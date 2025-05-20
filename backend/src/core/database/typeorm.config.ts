import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../common/entity/user.entity';
import { AdminEntity } from '../../modules/admin/admin.entity';
import { CompanyEntity } from '../../modules/company/entities/company.entity';
import { ProviderEntity } from '../../modules/provider/provider.entity';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { CertificationEntity } from '../../common/entity/certification.entity';
import { ContractEntity } from '../../common/entity/contract.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { ServiceEntity } from '../../common/entity/service.entity';
import { EventEntity } from '../../common/entity/event.entity';
import { BookingEntity } from '../../common/entity/booking.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';
import { QuestionAnswerEntity } from '../../common/entity/question-answer.entity';
import { AssociationEntity } from '../../common/entity/association.entity';
import { DonationEntity } from '../../common/entity/donation.entity';
import { VolunteeringActivityEntity } from '../../common/entity/volunteering-activity.entity';
import { VolunteerRegistrationEntity } from '../../common/entity/volunteer-registration.entity';
import { AdviceEntity } from '../../common/entity/advice.entity';
import { ReportEntity } from '../../common/entity/report.entity';
import { QuoteEntity } from '../../common/entity/quote.entity';
import { NotificationEntity } from '../../common/entity/notification.entity';
import { CommentEntity } from '../../common/entity/comment.entity';
import { PostEntity } from '../../common/entity/post.entity';
import { MessageEntity } from '../../common/entity/message.entity';
import { DevisEntity } from '../../common/entity/devis.entity';

export const createTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USER', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_NAME', 'business_care_db'),
    entities: [
      UserEntity,
      AdminEntity,
      CompanyEntity,
      ProviderEntity,
      EmployeeEntity,
      CertificationEntity,
      ContractEntity,
      InvoiceEntity,
      ServiceEntity,
      EventEntity,
      BookingEntity,
      AvailabilitySlotEntity,
      EvaluationEntity,
      QuestionAnswerEntity,
      QuoteEntity,
      AdviceEntity,
      AssociationEntity,
      DonationEntity,
      VolunteeringActivityEntity,
      VolunteerRegistrationEntity,
      ReportEntity,
      NotificationEntity,
      CommentEntity,
      PostEntity,
      MessageEntity,
      DevisEntity,
    ],
    synchronize: true,
  };
};
