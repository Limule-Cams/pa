import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeEntity } from '../../employee/employee.entity';
import { ContractEntity } from '../../../common/entity/contract.entity';
import { SubscriptionTier } from '../../../common/enum/subscription-tier.enum';
import { CompanyStatus } from '../../../common/enum/company-status.enum';
import { EventEntity } from '../../../common/entity/event.entity';
import { UserEntity } from '../../../common/entity/user.entity';
import { InvoiceEntity } from '../../../common/entity/invoice.entity';

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, name: 'registry_number' })
  registryNumber: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  city: string;

  @Column({ type: 'date', nullable: true, name: 'creation_date' })
  creationDate: Date;

  @Column({ type: 'varchar', length: 160, nullable: true })
  founder: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  industry: string;

  @Column({ name: 'phoneNumber', type: 'varchar', length: 25, nullable: true })
  phoneNumber: string;

  @Column({ name: 'size', type: 'varchar', length: 60, nullable: true })
  size: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    nullable: true,
    name: 'subscription_tier',
  })
  subscriptionTier: SubscriptionTier;

  @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.ACTIVE })
  status: CompanyStatus;

  @OneToMany(
    () => EmployeeEntity,
    (employee: EmployeeEntity) => employee.company,
  )
  employees: EmployeeEntity[];

  @OneToMany(
    () => ContractEntity,
    (contract: ContractEntity) => contract.company,
    { cascade: true },
  )
  contracts: ContractEntity[];

  @OneToMany(() => EventEntity, (event: EventEntity) => event.company)
  events: EventEntity[];

  @OneToMany(() => InvoiceEntity, (invoice: InvoiceEntity) => invoice.company)
  invoicesReceived: InvoiceEntity[];

  @Column({ default: false })
  subscriptionCompleted: boolean;

  @Column({ default: false })
  profileCompleted: boolean;

  @Column({ default: false })
  employeesCompleted: boolean;

  @Column({ default: false })
  contractCompleted: boolean;

  @Column({ default: false })
  tutorialCompleted: boolean;

}
