// src/auth/auth.service.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'; // Ajout ForbiddenException
import { UserTokenDto } from './dto/user-token.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../common/entity/user.entity';
import { Repository } from 'typeorm';
import { HashUtils } from '../core/utils/hash.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRoles } from '../common/enum/roles.enum';
import { AdminService } from '../modules/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashUtils: HashUtils,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<UserTokenDto> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (
      !user ||
      !(await this.hashUtils.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new ForbiddenException('INACTIVE_ACCOUNT');
    }

    user.lastLoginDate = new Date();
    await this.userRepository.save(user);

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    return { userId: user.id, accessToken: accessToken, role: user.role };
  }

  async register(
    registerDto: any,
  ): Promise<{ providerId: number; message: string } | void> {
    if (registerDto.user.role === UsersRoles.COMPANY) {
      await this.adminService.createCompany(registerDto);
    } else if (registerDto.user.role === UsersRoles.PROVIDER) {
      const newProvider = await this.adminService.createProvider(registerDto);
      return {
        providerId: newProvider,
        message:
          'New provider created successfully. Please wait for the admin to approve your account.',
      };
    }
  }
}