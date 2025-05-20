import { UsersRoles } from '../../common/enum/roles.enum';

export class UserTokenDto {
  userId: number;
  accessToken: string;
  role: UsersRoles;
}
