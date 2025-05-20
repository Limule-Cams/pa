import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UsersRoles } from '../../common/enum/roles.enum';
import { JwtToken } from '../../auth/jwt/jwt-token.interface';
import { BookingDto } from './dto/booking.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { ReportDto } from './dto/report.dto';
import { AdviceDto } from './dto/advice.dto';
import { AssociationDto } from './dto/association.dto';
import { MakeDonationDto } from './dto/make-donation.dto';
import { RegisterVolunteerDto } from './dto/register-volunteer.dto';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UsersRoles.CLIENT)
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(private readonly employeeService: EmployeeService) {}

  private getUserId(req: { user: JwtToken }): number {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      this.logger.error(`Invalid or missing userId in JWT token.`);
      throw new InternalServerErrorException('Invalid user identification.');
    }
    return userId;
  }

  @Get('profile')
  async getProfile(@Req() req: { user: JwtToken }): Promise<UserProfileDto> {
    const userId = this.getUserId(req);
    return this.employeeService.getProfile(userId);
  }

  @Get('services')
  async getAvailableServices(@Req() req: { user: JwtToken }): Promise<any[]> {
    return this.employeeService.getAvailableServices();
  }

  @Get('/service-details/:id')
  @HttpCode(HttpStatus.OK)
  async getServiceDetails(@Param('id') id: number): Promise<any> {
    return (await this.employeeService.getAvailableServices()).find(
      (service: any) => service.id === id,
    );
  }

  @Get('schedule')
  async getSchedule(@Req() req: { user: JwtToken }): Promise<BookingDto[]> {
    const userId = this.getUserId(req);
    return this.employeeService.getSchedule(userId);
  }

  @Post('report')
  async submitReport(
    @Body() reportDto: ReportDto,
  ): Promise<{ success: boolean }> {
    return this.employeeService.submitAnonymousReport(reportDto);
  }

  @Get('advice')
  async getAdvice(): Promise<AdviceDto[]> {
    return this.employeeService.getAdviceList();
  }

  // --- Associations / Dons / Bénévolat ---
  @Get('associations')
  async getAssociations(): Promise<AssociationDto[]> {
    return this.employeeService.getAssociationList();
  }

  @Post('associations/donate')
  async makeDonation(
    @Req() req: { user: JwtToken },
    @Body() donationData: MakeDonationDto,
  ): Promise<{ success: boolean; message: string; donationId?: number }> {
    const userId = this.getUserId(req);
    return this.employeeService.handleDonation(userId, donationData);
  }

  @Post('associations/volunteer')
  async volunteer(
    @Req() req: { user: JwtToken },
    @Body() volunteeringData: RegisterVolunteerDto,
  ): Promise<{ success: boolean; message: string; registrationId?: number }> {
    const userId = this.getUserId(req);
    return this.employeeService.handleVolunteering(userId, volunteeringData);
  }

  @Delete('bookings/:bookingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelBooking(
    @Req() req: { user: JwtToken },
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<void> {
    const userId = this.getUserId(req);
    await this.employeeService.cancelBooking(userId, bookingId);
  }

  @Get('/bookings/:id')
  @HttpCode(HttpStatus.OK)
  async getBooking(@Param('id') id: number): Promise<any[]> {
    return await this.employeeService.getSchedule(id);
  }

  @Post('booking/create')
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() bookingDto: any): Promise<void> {
    await this.employeeService.createBooking(bookingDto);
  }

  @Post('advice/create')
  @HttpCode(HttpStatus.CREATED)
  async createAdvice(@Body() adviceDto: any): Promise<any> {
    await this.employeeService.createAdvice(adviceDto);
  }

  @Get('events')
  @HttpCode(HttpStatus.OK)
  async getEvents(): Promise<any[]> {
    return await this.employeeService.getEventsList();
  }

  @Get('event/participate')
  @HttpCode(HttpStatus.OK)
  async participateEvent(
    @Query('employeeId') employeeId: number,
    @Query('eventId') eventId: number,
  ): Promise<void> {
    return await this.employeeService.eventParticipate(eventId, employeeId);
  }

  @Post('/post')
  @HttpCode(HttpStatus.CREATED)
  async submitPost(@Body() payload: any): Promise<void> {
    await this.employeeService.createCommunityPost(payload);
  }

  @Get('posts/all')
  @HttpCode(HttpStatus.OK)
  async getAllPosts(): Promise<any[]> {
    return await this.employeeService.getCommunityPosts();
  }

  @Post('comments')
  @HttpCode(HttpStatus.OK)
  async createComment(@Body() commentDto: any): Promise<any> {
    await this.employeeService.createComment(commentDto);
  }

  @Get('/messages')
  @HttpCode(HttpStatus.OK)
  async getMessages(): Promise<any[]> {
    return await this.employeeService.getChatMessages();
  }

  @Post('messages')
  @HttpCode(HttpStatus.OK)
  async createMessage(@Body() messageDto: any): Promise<any> {
    await this.employeeService.createMessage(messageDto);
  }

  @Post('evaluation')
  async setEvaluation(@Body() dto: any, @Req() req: { user: JwtToken }) {
    const userId = this.getUserId(req);
    return await this.employeeService.setEvaluation(
      dto.providerId,
      userId,
      dto.isLike,
    );
  }

  @Get('evaluation/:providerId')
  async getMyEvaluation(
    @Param('providerId', ParseIntPipe) providerId: number,
    @Req() req: { user: JwtToken },
  ) {
    const userId = this.getUserId(req);
    return await this.employeeService.getEmployeeEvaluation(providerId, userId);
  }
}