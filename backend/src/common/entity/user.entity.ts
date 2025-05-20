import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersRoles } from '../enum/roles.enum';
import { NotificationEntity } from './notification.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UsersRoles, nullable: false })
  role: UsersRoles;

  @Column({ type: 'datetime', nullable: true })
  lastLoginDate?: Date;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];
}
