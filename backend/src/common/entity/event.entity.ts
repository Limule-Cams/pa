import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from '../../modules/company/entities/company.entity';
import { BookingEntity } from './booking.entity';
import { EmployeeEntity } from '../../modules/employee/employee.entity';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'datetime', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true, name: 'end_date' })
  endDate?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'image_url' })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.events, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'company_id' })
  company?: CompanyEntity | null;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];

  @ManyToMany(() => EmployeeEntity, (employee) => employee.events)
  @JoinTable({
    name: 'event_employees',
    joinColumn: {
      name: 'event_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'employee_id',
      referencedColumnName: 'id',
    },
  })
  employees: EmployeeEntity[];
}