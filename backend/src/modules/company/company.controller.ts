import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersRoles } from '../../common/enum/roles.enum';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Request } from 'express';
import { StripeService } from '../../core/payment/stripe.service';

@Controller('company')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UsersRoles.COMPANY, UsersRoles.ADMIN)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly stripeService: StripeService,
  ) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getCompanyInfo(@Req() request: Request): Promise<any> {
    console.log(request);
    const companyId = request.user;
    return await this.companyService.findCompanyByUserId(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (companyId as any).userId,
    );
  }

  @Post('/create-payement-intent')
  @HttpCode(HttpStatus.OK)
  async createPaymentIntent(@Body() paymentDto: any, @Req() request: Request) {
    try {
      const metadata = {
        user_id: (request.user as any)?.userId?.toString() || 'unknown',
        ...paymentDto.metadata, // Merge any additional metadata from request
      };

      const paymentIntent = await this.stripeService.createPaymentIntent(
        paymentDto.amount,
        paymentDto.currency || 'eur',
        metadata, // Pass formatted metadata
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      );

      return {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/save-contract')
  @HttpCode(HttpStatus.OK)
  async saveNewContract(
    @Body() contractDto: any,
    @Req() request: Request,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const userId = (request.user as any)?.userId?.toString();
    return this.companyService.createContract(contractDto, userId);
  }

  @Get('/contracts')
  @HttpCode(HttpStatus.OK)
  async getCompanyContracts(@Req() req: Request): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const companyId = (req.user as any)?.userId?.toString();
    return this.companyService.findContractsByCompany(companyId);
  }

  @Get('/validate-contract')
  @HttpCode(HttpStatus.OK)
  async validateContractStep(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const companyId = (request.user as any)?.userId?.toString();
    await this.companyService.validateContractStep(companyId);
  }

  @Get('/payments')
  @HttpCode(HttpStatus.OK)
  async getPayments(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const companyId = (req.user as any)?.userId?.toString();
    return this.companyService.findInvoicesByCompany(companyId);
  }

  @Post('/employees/import')
  @HttpCode(HttpStatus.CREATED)
  async importEmployees(@Body() employeesList: any[], @Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const companyId = (request.user as any)?.userId?.toString();
    if (!companyId) {
      throw new HttpException('Company ID not found', HttpStatus.BAD_REQUEST);
    }
    return await this.companyService.importEmployees(
      employeesList,
      parseInt(companyId),
    );
  }

  @Delete('/employee/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEmployee(
    @Req() request: Request,
    @Param('id') employeeId: number,
  ) {
    await this.companyService.deleteEmployee(employeeId);
  }

  @Get('/employees')
  @HttpCode(HttpStatus.OK)
  async getEmployees(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const companyId = (request.user as any)?.userId?.toString();
    return await this.companyService.findEmployeesByCompany(companyId);
  }

  @Patch('/edit')
  @HttpCode(HttpStatus.OK)
  async editCompany(@Body() companyDto: any, @Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const companyId = (request.user as any)?.userId?.toString();
    return await this.companyService.updateCompany(companyId, companyDto);
  }
}
