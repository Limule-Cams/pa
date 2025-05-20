import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { ServiceEntity } from './service.entity';
import { EventEntity } from './event.entity';
import { ProviderEntity } from './provider.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED_EMPLOYEE = 'cancelled_employee',
  CANCELLED_PROVIDER = 'cancelled_provider',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.bookings, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @Column({ name: 'employee_id', nullable: true })
  employeeId: number;

  @ManyToOne(() => ServiceEntity, {
    nullable: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'service_id' })
  service?: ServiceEntity;

  @ManyToOne(() => EventEntity, {
    nullable: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'event_id' })
  event?: EventEntity;

  @ManyToOne('ProviderEntity', 'bookings', {
    nullable: false,
  })
  @JoinColumn({ name: 'provider_id' })
  provider: ProviderEntity;

  @Column({ type: 'datetime', name: 'booking_date' })
  bookingDate: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}