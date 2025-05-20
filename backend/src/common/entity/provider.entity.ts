import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ContractStatus } from '../../common/enum/contract-status.enum';
import { ServiceEntity } from './service.entity';
import { InvoiceEntity } from './invoice.entity';
import { CertificationEntity } from './certification.entity';
import { UserEntity } from './user.entity';
import { AvailabilitySlotEntity } from './availability-slot.entity';
import { EvaluationEntity } from './evaluation.entity';

@Entity('provider')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name'})
  lastName: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'boolean', default: true, name: 'is_available' })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'bank_account_number' })
  bankAccountNumber: string;

  @Column({
    type: 'enum',
    enum: ContractStatus, 
    default: ContractStatus.PENDING,
    name: 'validation_status'
  })
  validationStatus: ContractStatus;

  @OneToMany(() => CertificationEntity, (certification) => certification.provider, { cascade: true })
  certifications: CertificationEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.provider)
  services: ServiceEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.provider)
  invoices: InvoiceEntity[];

  @OneToMany(() => AvailabilitySlotEntity, (slot) => slot.provider, { cascade: true })
  availabilitySlots: AvailabilitySlotEntity[];

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.provider)
  evaluationsReceived: EvaluationEntity[];
}