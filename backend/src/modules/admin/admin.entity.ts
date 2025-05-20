import { UserEntity } from '../../common/entity/user.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ name: 'city', type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ name: 'zip_code', type: 'varchar', length: 5, nullable: true })
  zipCode: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 10, nullable: true })
  phoneNumber: string;
}
