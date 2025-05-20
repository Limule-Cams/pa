import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProviderEntity } from '../../modules/provider/provider.entity';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { BookingEntity } from './booking.entity';

@Entity('evaluation')
export class EvaluationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProviderEntity, (provider) => provider.evaluationsReceived, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: ProviderEntity;

  @Column({ name: 'provider_id' })
  providerId: number;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.evaluationsGiven, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'rated_by_employee_id' })
  ratedByEmployee?: EmployeeEntity;

  @ManyToOne(() => BookingEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'booking_id' })
  booking?: BookingEntity;

  @Column({ type: 'tinyint', nullable: true })
  rating: number;

  @Column({ name: 'is_like', nullable: true })
  isLike?: boolean;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}