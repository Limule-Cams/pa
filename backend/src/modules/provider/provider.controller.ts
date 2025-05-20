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
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UsersRoles } from '../../common/enum/roles.enum';
import { JwtToken } from '../../auth/jwt/jwt-token.interface';
import { ProviderProfileDto } from './dto/provider-profile.dto';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto';
import { BookingStatus } from '../../common/entity/booking.entity';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

class GetInterventionsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
class GetAvailabilityQueryDto {
  @IsNotEmpty({ message: 'startDate query parameter is required' })
  @IsDateString(
    {},
    { message: 'startDate must be a valid ISO 8601 date string' },
  )
  startDate: string;

  @IsNotEmpty({ message: 'endDate query parameter is required' })
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  endDate: string;
}

@Controller('provider/')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UsersRoles.PROVIDER)
export class ProviderController {
  private readonly logger = new Logger(ProviderController.name);

  constructor(private readonly providerService: ProviderService) {}

  private getUserId(req: { user: JwtToken }): number {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      this.logger.error(`Invalid or missing userId in JWT token.`);
      throw new InternalServerErrorException('Invalid user identification.');
    }
    return userId;
  }

  @Get('profile')
  async getProfile(
    @Req() req: { user: JwtToken },
  ): Promise<ProviderProfileDto> {
    const userId = this.getUserId(req);
    return this.providerService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: { user: JwtToken },
    @Body() updateDto: UpdateProviderProfileDto,
  ): Promise<ProviderProfileDto> {
    const userId = this.getUserId(req);
    return this.providerService.updateProfile(userId, updateDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UseGuards()
  @Roles()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/provider-documents',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`); // Simplified filename
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              'Invalid file type. Only JPG, PNG, PDF and DOC files are allowed',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 6, // Maximum 6 files allowed
      },
    }),
  )
  async registerProvider(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProviderDto: any,
  ) {
    const documentsMeta: any[] = [];
    for (let i = 0; i < 6; i++) {
      const title = createProviderDto[`documents[${i}].title`];
      if (title) {
        documentsMeta.push({
          index: i,
          title,
          type: createProviderDto[`documents[${i}].type`],
          description: createProviderDto[`documents[${i}].description`] || '',
        });
      } else {
        break;
      }
    }

    const documents = files.map((file, idx) => {
      const meta = documentsMeta.find((m) => m.index === idx);
      return {
        title: meta?.title || `Document ${idx + 1}`,
        type: meta?.type || 'other',
        description: meta?.description || '',
        filePath: `uploads/provider-documents/${file.filename}`,
      };
    });

    const providerData = {
      providerId: parseInt(createProviderDto.providerId),
      siret: createProviderDto.siret,
      mainActivity: createProviderDto.mainActivity,
      yearsExperience: parseInt(createProviderDto.yearsExperience),
      description: createProviderDto.description,
      services: JSON.parse(createProviderDto.services),
      documents,
    };
    return await this.providerService.registerProviderApplication(providerData);
  }

  @Get('/services')
  async getProviderServices(@Req() request: Request): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const providerId = (request.user as any)?.userId?.toString();
    return await this.providerService.getServicesList(providerId);
  }

  @Delete('service/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteService(@Param('id') id: number): Promise<void> {
    await this.providerService.deleteService(id);
  }

  @Patch('service/:id/update')
  @HttpCode(HttpStatus.OK)
  async updateService(
    @Param('id') id: number,
    @Body() payload: any,
  ): Promise<void> {
    await this.providerService.updateProviderService(id, payload);
  }

  @Post('service')
  @HttpCode(HttpStatus.OK)
  async createService(
    @Body() payload: any,
    @Req() request: Request,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const providerId = (request.user as any)?.userId?.toString();
    await this.providerService.createService(payload, providerId);
  }

  @Get('/bookings')
  @HttpCode(HttpStatus.OK)
  async getProviderBookings(@Req() request: Request): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const providerId = (request.user as any)?.userId?.toString();
    return await this.providerService.getProviderBookings(providerId);
  }

  @Patch('/booking/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateBookingStatus(
    @Param('id') id: number,
    @Body() action: any,
  ): Promise<void> {
    await this.providerService.updateBooking(id, action);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request: Request): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const providerId = (request.user as any)?.userId?.toString();
    return this.providerService.findProviderByUserId(providerId);
  }

  @Get('/payments')
  @HttpCode(HttpStatus.OK)
  async getPayment(@Req() request: Request): Promise<any> {
    const providerId = (request.user as any)?.userId?.toString();
    return this.providerService.findProviderInvoices(providerId);
  }
}