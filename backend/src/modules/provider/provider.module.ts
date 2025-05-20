import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderEntity } from './provider.entity';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { UserEntity } from '../../common/entity/user.entity';
import { CertificationEntity } from '../../common/entity/certification.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';
import { BookingEntity } from '../../common/entity/booking.entity';
import { EmployeeEntity } from '../employee/employee.entity';
import { PdfModule } from '../../core/pdf/pdf.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderEntity,
            UserEntity,
            CertificationEntity,
            InvoiceEntity,
            AvailabilitySlotEntity,
            EvaluationEntity,
            BookingEntity,
            EmployeeEntity,
        ]),
        PdfModule,
    ],
    controllers: [ProviderController],
    providers: [ProviderService],
    exports: [ProviderService],
})
export class ProviderModule {}