import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ProviderEntity } from '../../modules/provider/provider.entity';
import { BookingEntity } from './booking.entity';
import { SlotStatus } from '../enum/slot-status.enum';

@Entity('availability_slot')
export class AvailabilitySlotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'provider_id' }) 
  providerId: number;

  @ManyToOne(() => ProviderEntity)
  @JoinColumn({ name: 'provider_id' })
  provider: ProviderEntity;

  @Column({ type: 'datetime', name: 'start_time' })
  startTime: Date;

  @Column({ type: 'datetime', name: 'end_time' })
  endTime: Date;

  @Column({ type: 'enum', enum: SlotStatus, default: SlotStatus.AVAILABLE })
  status: SlotStatus;

  @Column({ type: 'int', name: 'booking_id', nullable: true }) 
  bookingId: number | null;                                    

  @OneToOne(() => BookingEntity, { nullable: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'booking_id' }) 
  booking: BookingEntity | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , name: 'created_at'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}