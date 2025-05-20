// src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminEntity } from './admin.entity';
import { UserEntity } from '../../common/entity/user.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { ProviderEntity } from '../provider/provider.entity';
import { EmployeeEntity } from '../employee/employee.entity';
import { ContractEntity } from '../../common/entity/contract.entity';
import { ServiceEntity } from '../../common/entity/service.entity';
import { EventEntity } from '../../common/entity/event.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { CertificationEntity } from '../../common/entity/certification.entity';
import { BookingEntity } from '../../common/entity/booking.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { QuestionAnswerEntity } from '../../common/entity/question-answer.entity';
import { ReportEntity } from '../../common/entity/report.entity';
import { NotificationModule } from '../../core/notification/notification.module';
import { CoreModule } from '../../core/core.module'; 
import { QuoteEntity } from '../../common/entity/quote.entity';
import { DevisEntity } from '../../common/entity/devis.entity';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      AdminEntity,
      UserEntity,
      CompanyEntity,
      ProviderEntity,
      EmployeeEntity,
      ContractEntity,
      ServiceEntity,
      EventEntity,
      InvoiceEntity,
      CertificationEntity,
      BookingEntity,
      EvaluationEntity,
      AvailabilitySlotEntity,
      QuestionAnswerEntity,
      ReportEntity,
      QuoteEntity,
      DevisEntity
    ]),
    NotificationModule, 
    CoreModule, 
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}