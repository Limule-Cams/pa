import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { QuestionAnswerEntity } from '../../common/entity/question-answer.entity';
import { EmployeeModule } from '../employee/employee.module';
import { CompanyModule } from '../company/company.module';
import { EmployeeEntity } from '../employee/employee.entity';
import { UserEntity } from '../../common/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionAnswerEntity,
      EmployeeEntity,
      UserEntity
    ]),
    forwardRef(() => EmployeeModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}