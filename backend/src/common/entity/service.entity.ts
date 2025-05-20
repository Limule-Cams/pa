import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProviderEntity } from '../../modules/provider/provider.entity';
import { BookingEntity } from './booking.entity';

@Entity('service')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true, name: 'is_available' })
  isAvailable: boolean = true;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, name: 'realisation_time' })
  realisationTime: string;

  @Column({ type: 'boolean', default: false, name: 'is_medical' })
  isMedical: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_negotiable' })
  isNegotiable: boolean = false;

  @ManyToOne(() => ProviderEntity, (provider) => provider.services, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  provider?: ProviderEntity | null;

  @OneToMany(() => BookingEntity, (booking) => booking.service)
  bookings: BookingEntity[];
}