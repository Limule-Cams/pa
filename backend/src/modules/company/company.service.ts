// src/modules/company/company.service.ts
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { ContractEntity } from '../../common/entity/contract.entity';
import { EmployeeEntity } from '../employee/employee.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { ContractDto } from './dto/contract.dto';
import { EmployeeSummaryDto } from './dto/employee-summary.dto';
import { UserEntity } from '../../common/entity/user.entity';
import { SubscriptionTier } from '../../common/enum/subscription-tier.enum';
import { HashUtils } from '../../core/utils/hash.utils';
import { NotificationService } from '../../core/notification/notification.service';
import { StripeService } from '../../core/payment/stripe.service';
import { PdfService } from '../../core/pdf/pdf.service';
import { CompanyStatus } from '../../common/enum/company-status.enum';
import { QuoteEntity } from '../../common/entity/quote.entity';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { InvoiceStatus } from '../../common/enum/invoice-status.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(QuoteEntity)
    private readonly quoteRepository: Repository<QuoteEntity>,
    private readonly hashUtils: HashUtils,
    private readonly notificationService: NotificationService,
    private readonly stripeService: StripeService,
    private readonly pdfService: PdfService,
  ) {}

  // --- Helpers ---
  async findCompanyByUserId(userId: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'employees', 'contracts'],
    });
    if (!company) {
      throw new ForbiddenException('COMPANY_NOT_FOUND');
    }
    if (company.status !== CompanyStatus.ACTIVE) {
      throw new ForbiddenException('INACTIVE_ACCOUNT');
    }
    return company;
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
        this.logger.warn(`Unhandled tier in getRate: ${tier}.`);
        return 180;
    }
  }

  public getTierLimits(tier: SubscriptionTier | null): {
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
        this.logger.warn(`Unhandled tier in getLimits: ${safeTier}.`);
        return {
          activities: 0,
          medicalRDV: 0,
          chatbotQuestions: 0,
          customAdvice: false,
          rdvCost: 75,
        };
    }
  }

  async validateContractStep(companyId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: companyId } },
    });
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }
    company.contractCompleted = true;
    await this.companyRepository.save(company);
  }

  // --- Contrats ---
  async findContractsByCompany(companyId: number): Promise<ContractDto[]> {
    const contracts = await this.contractRepository.find({
      where: { company: { user: { id: companyId } } },
      order: { startDate: 'DESC' },
    });
    return contracts.map((c) => ({
      id: c.id,
      startDate: c.startDate,
      endDate: c.endDate,
      status: c.status,
      renewable: c.renewable,
      conditions: c.conditions,
      fileUrl: c.fileUrl,
      companyId: companyId,
      price: c.price,
      subscriptionTier: c.subscriptionTier,
    }));
  }

  async findContractById(
    companyId: number,
    contractId: number,
  ): Promise<ContractDto> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, company: { id: companyId } },
    });
    if (!contract) {
      throw new NotFoundException('CONTRACT_NOT_FOUND');
    }
    return {
      id: contract.id,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status,
      renewable: contract.renewable,
      conditions: contract.conditions,
      fileUrl: contract.fileUrl,
      companyId: companyId,
    };
  }

  async createContract(
    contractDto: any,
    companyId: number,
  ): Promise<{ contract: any; invoice: any }> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: companyId } },
    });
    if (!company) {
      throw new NotFoundException('COMPANY_NOT_FOUND');
    }

    company.subscriptionTier = contractDto.subscriptionTier;

    const startDate = new Date();
    const endDate = this.calculateEndDate(
      startDate,
      contractDto.durationMonths || 12,
    );

    // Create and save contract
    const newContract = this.contractRepository.create({
      company: company,
      startDate: startDate,
      endDate: endDate,
      status: ContractStatus.ACTIVE,
      renewable: true,
      conditions: '',
      price: contractDto.price,
    });

    // Generate and save contract PDF
    const contractFileUrl = await this.pdfService.generateContract({
      ...newContract,
      company: company,
    });
    newContract.fileUrl = contractFileUrl;
    await this.contractRepository.save(newContract);

    // Create and save invoice
    const invoice = this.invoiceRepository.create({
      invoiceNumber: 'INV-' + Math.floor(Math.random() * 1000000000),
      invoiceDate: startDate,
      dueDate: new Date(startDate.setDate(startDate.getDate() + 30)),
      status: InvoiceStatus.PAYED,
      company: company,
      totalAmount: contractDto.price,
      paymentReference: `SUBSCRIPTION_${contractDto.subscriptionTier}`,
    });

    // Generate and save invoice PDF
    const invoiceFileUrl = await this.pdfService.generateInvoicePdf(invoice);
    invoice.documentUrl = invoiceFileUrl;
    await this.invoiceRepository.save(invoice);

    // Update company status
    company.subscriptionCompleted = true;
    await this.companyRepository.save(company);

    return {
      contract: newContract,
      invoice: invoice,
    };
  }

  private calculateEndDate(startDate: Date, durationMonths: number): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate;
  }

  // --- Devis / Facturation ---
  async findInvoicesByCompany(companyId: number): Promise<any[]> {
    const invoices = await this.invoiceRepository.find({
      where: { company: { user: { id: companyId } } },
      order: { invoiceDate: 'DESC' },
    });
    return invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      status: inv.status,
      totalAmount: inv.totalAmount,
      documentUrl: inv.documentUrl,
      description: inv.description,
      subscription: inv.paymentReference,
    }));
  }

  async importEmployees(
    employeesList: any[],
    companyId: number,
  ): Promise<EmployeeEntity[]> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: companyId } },
    });
    if (!company) {
      throw new Error('Company not found');
    }
    const employees = await this.employeeRepository.find({
      where: { company: company },
      relations: ['user'],
    });

    await this.userRepository.remove(employees.map((e) => e.user));
    await this.employeeRepository.remove(employees);

    const createdEmployees: EmployeeEntity[] = [];

    for (const employeeData of employeesList) {
      const hashedPassword = await bcrypt.hash(employeeData.user.password, 10);
      const user = this.userRepository.create({
        email: employeeData.user.email,
        password: hashedPassword,
        role: employeeData.user.role,
        isActive: employeeData.user.isActive,
      });
      await this.userRepository.save(user);
      console.log(employeeData.employee.startingDate);
      const employee = this.employeeRepository.create({
        user,
        name: employeeData.employee.name,
        lastName: employeeData.employee.lastName,
        address: employeeData.employee.address,
        occupied_job: employeeData.employee.occupied_job,
        startingDate: employeeData.employee.startingDate,
        endDate: employeeData.employee.endDate,
        contractType: employeeData.employee.contractType,
        company,
      });
      await this.employeeRepository.save(employee);
      createdEmployees.push(employee);
    }
    company.employeesCompleted = true;
    await this.companyRepository.save(company);
    return createdEmployees;
  }

  // --- Collaborateurs ---
  async findEmployeesByCompany(
    companyId: number,
  ): Promise<EmployeeSummaryDto[]> {
    const employees = await this.employeeRepository.find({
      where: {
        company: { user: { id: companyId } },
      },
      relations: ['user'],
      order: { lastName: 'ASC', name: 'ASC' },
    });
    return employees.map((emp) => ({
      id: emp.id,
      userId: emp.user.id,
      firstName: emp.name,
      lastName: emp.lastName,
      email: emp.user.email,
      occupied_job: emp.occupied_job,
      startingDate: emp.startingDate,
      endDate: emp.endDate,
      contractType: emp.contractType,
    }));
  }

  async deleteEmployee(employeeId: number): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ['user']
    });
    if (!employee) {
      throw new NotFoundException('EMPLOYEE_NOT_FOUND');
    }
    await this.userRepository.remove(employee.user);
    await this.employeeRepository.remove(employee);
  }

  async updateCompany(
    companyId: number,
    updateData: DeepPartial<CompanyEntity>,
  ): Promise<void> {
    this.logger.log(`Admin attempting to update company ID: ${companyId}`);
    const company = await this.companyRepository.findOneBy({
      user: { id: companyId },
    });
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
      company.profileCompleted = true;
      await this.companyRepository.save(company);
      this.logger.log(`Company ${companyId} updated successfully.`);
    } catch (error) {
      this.logger.error(
        `Failed to update company ${companyId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
    }
  }

  // --- Abonnements ---
  async getSubscriptionDetails(companyId: number): Promise<any> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['employees'],
    });
    if (!company) throw new NotFoundException('COMPANY_NOT_FOUND');
    const tier = company.subscriptionTier;
    const limits = this.getTierLimits(tier);
    const employeeCount = Array.isArray(company.employees)
      ? company.employees.length
      : 0;
    const rate = this.getRatePerEmployee(tier);
    const annualCost = rate * employeeCount;
    return {
      companyId: company.id,
      companyName: company.name,
      plan: tier || 'Non défini',
      status: company.status,
      employeeCount: employeeCount,
      pricePerEmployeePerYear: rate,
      estimatedAnnualCost: parseFloat(annualCost.toFixed(2)),
      limits: limits,
    };
  }
}
