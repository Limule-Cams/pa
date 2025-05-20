import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException, UnauthorizedException, Logger, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsersRoles } from '../../common/enum/roles.enum';
import { JwtToken } from '../../auth/jwt/jwt-token.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../common/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
      private reflector: Reflector,
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UsersRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtToken }>();
    const userToken = request.user;

    if (!userToken || typeof userToken.userId === 'undefined') {
        this.logger.warn('Access denied: No valid user token found in request.');
        throw new UnauthorizedException('Authentication required.');
    }

    const userIdNum = parseInt(String(userToken.userId), 10);
    if (isNaN(userIdNum)) {
         this.logger.error(`Invalid userId format in JWT token: ${userToken.userId}`);
         throw new InternalServerErrorException('Invalid user identifier format in token.');
    }

    let user: UserEntity | null;
    try {
        user = await this.userRepository.findOneBy({ id: userIdNum });
    } catch (error) {
        this.logger.error(`Database error fetching user ${userIdNum} for role check: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Error verifying user authorization.');
    }

    if (!user) {
         this.logger.warn(`Access denied: User ${userIdNum} not found.`);
         throw new ForbiddenException('User not found.');
    }
    if (!user.isActive) {
        this.logger.warn(`Access denied: User ${userIdNum} is inactive.`);
        throw new ForbiddenException('User account is inactive.'); 
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
        this.logger.warn(`Access denied: User ${userIdNum} (Role: ${user.role}) does not have required roles: ${requiredRoles.join(', ')}`);
        throw new ForbiddenException('Insufficient permissions.'); 
    }

    return true;
  }
}