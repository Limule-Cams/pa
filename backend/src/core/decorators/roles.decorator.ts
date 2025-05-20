// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UsersRoles } from '../../common/enum/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UsersRoles[]) => SetMetadata(ROLES_KEY, roles);
