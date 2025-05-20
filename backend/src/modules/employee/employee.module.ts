import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { UserEntity } from '../../common/entity/user.entity';
import { ServiceEntity } from '../../common/entity/service.entity';
import { BookingEntity } from '../../common/entity/booking.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { EventEntity } from '../../common/entity/event.entity';
import { AdviceEntity } from '../../common/entity/advice.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { NotificationModule } from '../../core/notification/notification.module';
import { AssociationEntity } from '../../common/entity/association.entity';
import { DonationEntity } from '../../common/entity/donation.entity';
import { VolunteeringActivityEntity } from '../../common/entity/volunteering-activity.entity';
import { VolunteerRegistrationEntity } from '../../common/entity/volunteer-registration.entity';
import { ReportEntity } from '../../common/entity/report.entity';
import { CompanyModule } from '../company/company.module';
import { ProviderEntity } from '../provider/provider.entity';
import { PostEntity } from '../../common/entity/post.entity';
import { CommentEntity } from '../../common/entity/comment.entity';
import { MessageEntity } from '../../common/entity/message.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeEntity,
      UserEntity,
      ServiceEntity,
      BookingEntity,
      CompanyEntity,
      EventEntity,
      AdviceEntity,
      AvailabilitySlotEntity,
      AssociationEntity,
      DonationEntity,
      VolunteeringActivityEntity,
      VolunteerRegistrationEntity,
      ReportEntity,
      ProviderEntity,
      PostEntity,
      CommentEntity,
      MessageEntity,
      EvaluationEntity
    ]),
    NotificationModule,
    CompanyModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}