// src/modules/admin/admin.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UsersRoles } from '../../common/enum/roles.enum';
import { CompanyListItemDto } from './dto/company-list-item.dto';
import { ProviderListItemDto } from './dto/provider-list-item.dto';
import { UpdateProviderValidationDto } from './dto/update-provider-validation.dto';
import { CreateUpdateServiceDto } from './dto/create-update-service.dto';
import { ServiceDetailsDto } from './dto/service-details.dto';
import { CompanyStatus } from '../../common/enum/company-status.enum';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { ReportStatus } from '../../common/enum/report-status.enum';
import { QuoteStatus } from '../../common/enum/quote-status.enum';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CompanyEntity } from '../company/entities/company.entity';
import { ProviderEntity } from '../provider/provider.entity';
import { Transform, Type } from 'class-transformer';
import { AdminReportDto } from './dto/admin-report.dto';
import { ReportEntity } from '../../common/entity/report.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventDetailsDto } from './dto/event-details.dto';
import { CreateQaDto } from './dto/create-qa.dto';
import { UpdateQaDto } from './dto/update-qa.dto';
import { QaListItemDto } from './dto/qa-list-item.dto';
import { QaDetailsDto } from './dto/qa-details.dto';
import { QuoteListItemDto } from './dto/quote-list-item.dto';
import { QuoteDetailsDto } from './dto/quote-details.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { CreateContractFromQuoteDto } from './dto/create-contract-from-quote.dto';
import { ContractDto } from '../company/dto/contract.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

// --- DTOs pour Query Params ---
class PaginationQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number =
    10;
}

class CompanyQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(CompanyStatus) status?: CompanyStatus;
  @IsOptional() @IsString() name?: string;
}

class ProviderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  @IsBoolean()
  isVerified?: boolean;
  @IsOptional() @IsEnum(ContractStatus) status?: ContractStatus;
  @IsOptional() @IsString() name?: string;
}

class ServiceQueryDto extends PaginationQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() providerId?: number | null;
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  @IsBoolean()
  isAvailable?: boolean;
  @IsOptional() @IsString() title?: string;
}

class TriggerInvoiceDto {
  @IsNotEmpty() @Type(() => Number) @IsInt() @Min(1) @Max(12) month: number;
  @IsNotEmpty() @Type(() => Number) @IsInt() @Min(2020) year: number;
}

class VerifyCertificationDto {
  @IsNotEmpty() @IsBoolean() verified: boolean;
}

class ChangeCompanyStatusDto {
  @IsNotEmpty() @IsEnum(CompanyStatus) status: CompanyStatus;
}

class ReportQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(ReportStatus) status?: ReportStatus;
  @IsOptional() @IsString() category?: string;
}

class ChangeReportStatusDto {
  @IsNotEmpty() @IsEnum(ReportStatus) status: ReportStatus;
}

class EventQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  @IsBoolean()
  isActive?: boolean;
  @IsOptional()
  @Transform(({ value }) =>
    value === 'global' ? 'global' : parseInt(value, 10) || undefined,
  )
  companyId?: number | 'global';
  @IsOptional() @IsDateString() date?: string;
}

class QaQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  @IsBoolean()
  isActive?: boolean;
  @IsOptional() @IsString() query?: string;
}

class QuoteQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(QuoteStatus) status?: QuoteStatus;
  @IsOptional() @Type(() => Number) @IsInt() companyId?: number;
  @IsOptional() @IsString() query?: string;
}

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UsersRoles.ADMIN)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  // --- Compagnies ---
  @Get('companies')
  async findAllCompanies(): Promise<{
    data: CompanyListItemDto[];
    total: number;
  }> {
    return await this.adminService.findAllCompanies();
  }

  @Get('companies/:id')
  async findCompanyDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompanyEntity> {
    return this.adminService.findCompanyDetails(id);
  }

  @Get('/employees')
  async findEmployees(): Promise<any> {
    return await this.adminService.findAllEmployees();
  }

  @Post('companies')
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<void> {
    await this.adminService.createCompany(createCompanyDto);
  }

  @Patch('companies/:id')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: any,
  ): Promise<CompanyEntity> {
    return this.adminService.updateCompany(id, updateCompanyDto);
  }

  @Patch('companies/:id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeCompanyStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusUpdate: ChangeCompanyStatusDto,
  ): Promise<void> {
    await this.adminService.changeCompanyStatus(id, statusUpdate.status);
  }

  @Delete('companies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompany(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.deleteCompany(id);
  }

  // --- Prestataires ---
  @Get('providers')
  async findAllProviders(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: ProviderQueryDto,
  ): Promise<{ data: any[]; total: number }> {
    return this.adminService.findAllProviders();
  }

  @Get('providers/:id')
  async findProviderDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProviderEntity> {
    return this.adminService.findProviderDetails(id);
  }

  @Patch('providers/:id/validation')
  async updateProviderValidation(
    @Param('id', ParseIntPipe) id: number,
    @Body() validationDto: UpdateProviderValidationDto,
  ): Promise<ProviderListItemDto> {
    return this.adminService.updateProviderValidation(id, validationDto);
  }

  @Patch('certifications/:id/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyCertification(
    @Param('id', ParseIntPipe) id: number,
    @Body() verificationStatus: VerifyCertificationDto,
  ): Promise<void> {
    await this.adminService.verifyCertification(
      id,
      verificationStatus.verified,
    );
  }

  // --- Services ---
  @Get('services')
  async findAllServices(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: ServiceQueryDto,
  ): Promise<{ data: ServiceDetailsDto[]; total: number }> {
    return this.adminService.findAllServices(query);
  }

  @Get('services/:id')
  async findServiceDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceDetailsDto> {
    return this.adminService.findServiceDetails(id);
  }

  @Post('services')
  async createService(
    @Body() createServiceDto: CreateUpdateServiceDto,
  ): Promise<ServiceDetailsDto> {
    return this.adminService.createService(createServiceDto);
  }

  @Patch('services/:id')
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: CreateUpdateServiceDto,
  ): Promise<ServiceDetailsDto> {
    return this.adminService.updateService(id, updateServiceDto);
  }

  @Delete('services/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteService(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.deleteService(id);
  }

  // --- Signalements Anonymes ---
  @Get('reports/anonymous')
  async getAnonymousReports(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: ReportQueryDto,
  ): Promise<{ data: AdminReportDto[]; total: number }> {
    return this.adminService.getAnonymousReports(query);
  }

  @Get('reports/anonymous/:id')
  async getAnonymousReportDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReportEntity> {
    return this.adminService.getAnonymousReportDetails(id);
  }

  @Patch('reports/anonymous/:id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeReportStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusUpdate: ChangeReportStatusDto,
  ): Promise<void> {
    await this.adminService.updateReportStatus(id, statusUpdate.status);
  }

  // --- Événements ---
  @Get('events')
  async findAllEvents(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: EventQueryDto,
  ): Promise<any[]> {
    return this.adminService.findAllEvents();
  }

  @Get('events/:id')
  async findEventDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EventDetailsDto> {
    return this.adminService.findEventDetails(id);
  }

  @Post('events')
  async createEvent(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventDetailsDto> {
    return this.adminService.createEvent(createEventDto);
  }

  @Patch('events/:id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventDetailsDto> {
    return this.adminService.updateEvent(id, updateEventDto);
  }

  @Delete('events/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.deleteEvent(id);
  }

  @Get('events/:id/validate')
  async validateEvent(@Param('id', ParseIntPipe) id: number ): Promise<void> {
    await this.adminService.validateEvent(id)
  }

  // --- Chatbot Q/A Management ---
  @Get('chatbot/qa')
  async findAllQA(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: QaQueryDto,
  ): Promise<{ data: QaListItemDto[]; total: number }> {
    return this.adminService.findAllQA(query);
  }

  @Get('chatbot/qa/:id')
  async findQADetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QaDetailsDto> {
    return this.adminService.findQADetails(id);
  }

  @Post('chatbot/qa')
  async createQA(@Body() createQaDto: CreateQaDto): Promise<QaDetailsDto> {
    return this.adminService.createQA(createQaDto);
  }

  @Patch('chatbot/qa/:id')
  async updateQA(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQaDto: UpdateQaDto,
  ): Promise<QaDetailsDto> {
    return this.adminService.updateQA(id, updateQaDto);
  }

  @Delete('chatbot/qa/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQA(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.deleteQA(id);
  }

  // --- Devis Management (Admin) ---
  @Get('quotes')
  async findAllQuotes(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: QuoteQueryDto,
  ): Promise<{ data: QuoteListItemDto[]; total: number }> {
    return this.adminService.findAllQuotes(query);
  }

  @Get('quotes/:id')
  async findQuoteDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QuoteDetailsDto> {
    return this.adminService.findQuoteDetails(id);
  }

  @Patch('quotes/:id/status')
  async updateQuoteStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteStatusDto,
  ): Promise<QuoteDetailsDto> {
    return this.adminService.updateQuoteStatus(id, updateQuoteDto);
  }

  @Delete('quotes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuote(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.deleteQuote(id);
  }

  // --- Contrat Management (Admin) ---
  @Post('contracts/from-quote')
  @HttpCode(HttpStatus.CREATED)
  async createContractFromQuote(
    @Body() createDto: CreateContractFromQuoteDto,
  ): Promise<ContractDto> {
    return this.adminService.createContractFromQuote(createDto);
  }

  // --- Autres Endpoints Admin ---
  @Get('finances/summary')
  async getFinancialSummary(): Promise<any> {
    return this.adminService.getFinancialSummary();
  }

  @Post('invoices/providers/generate-monthly')
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerProviderInvoices(
    @Body() triggerDto: TriggerInvoiceDto,
  ): Promise<{
    message: string;
    generatedCount: number;
    totalAmount: number;
  }> {
    const result = await this.adminService.triggerProviderInvoiceGeneration(
      triggerDto.month,
      triggerDto.year,
    );
    return {
      message: `Provider invoice generation finished for ${triggerDto.month}/${triggerDto.year}.`,
      ...result,
    };
  }
  
  @Get('/providers/:id/activate')
  async activateProvider(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.activateProviderAccount(id);
  }

  @Post('devis')
  async createDevis(@Body() createDevisDto: any) {
    return this.adminService.createDevis(createDevisDto);
  }

  @Roles(UsersRoles.ADMIN, UsersRoles.COMPANY)
  @Get('devis')
  async findAllDevis() {
    return this.adminService.findAllDevis();
  }

  @Get('devis/:id')
  async findOneDevis(@Param('id') id: number) {
    return this.adminService.findOneDevis(id);
  }

  @Patch('devis/:id')
  async updateDevis(@Param('id') id: number, @Body() updateDevisDto: any) {
    return this.adminService.updateDevis(id, updateDevisDto);
  }

  @Delete('devis/:id')
  async removeDevis(@Param('id') id: number) {
    return this.adminService.removeDevis(id);
  }
}
