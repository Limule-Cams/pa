import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { ContractEntity } from '../../common/entity/contract.entity';
import { EmployeeEntity } from '../employee/employee.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { ServiceEntity } from '../../common/entity/service.entity';
import { UserEntity } from '../../common/entity/user.entity';
import { CoreModule } from '../../core/core.module'; 
import { NotificationModule } from '../../core/notification/notification.module';
import { QuoteEntity } from '../../common/entity/quote.entity';
import { PaymentModule } from '../../core/payment/payment.module';
import { PdfModule } from '../../core/pdf/pdf.module';   

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      ContractEntity,
      EmployeeEntity,
      InvoiceEntity,
      UserEntity,
      QuoteEntity,
    ]),
    CoreModule, 
    NotificationModule, 
    PaymentModule,
    PdfModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService], 
})
export class CompanyModule {}