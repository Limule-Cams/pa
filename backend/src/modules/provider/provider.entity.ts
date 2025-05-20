import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { ServiceEntity } from '../../common/entity/service.entity';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { CertificationEntity } from '../../common/entity/certification.entity';
import { UserEntity } from '../../common/entity/user.entity';
import { AvailabilitySlotEntity } from '../../common/entity/availability-slot.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';
import { BookingEntity } from '../../common/entity/booking.entity';

@Entity('provider')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 100, name: 'first_name', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 100, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 100, name: 'reference_name' })
  referenceName: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'registryNumber',
    nullable: true,
  })
  registryNumber: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'main_activity',
  })
  mainActivity: string;

  @Column({ name: 'years_of_experience', type: 'int', nullable: true })
  yearsOfExperience: number;

  @Column({ name: 'activity_description', nullable: true, type: 'varchar' })
  activityDescription: string;

  @Column({ type: 'boolean', default: true, name: 'is_available' })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'bank_account_number',
  })
  bankAccountNumber: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
    name: 'validation_status',
  })
  validationStatus: ContractStatus;

  @OneToMany(
    () => CertificationEntity,
    (certification) => certification.provider,
    { cascade: true },
  )
  certifications: CertificationEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.provider)
  bookings: BookingEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.provider)
  services: ServiceEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.provider)
  invoices: InvoiceEntity[];

  @OneToMany(() => AvailabilitySlotEntity, (slot) => slot.provider, {
    cascade: true,
  })
  availabilitySlots: AvailabilitySlotEntity[];

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.provider)
  evaluationsReceived: EvaluationEntity[];

}