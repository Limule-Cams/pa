import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractStatus } from '../enum/contract-status.enum';
import { CompanyEntity } from '../../modules/company/entities/company.entity';
import { QuoteEntity } from './quote.entity';
import { SubscriptionTier } from '../enum/subscription-tier.enum';

@Entity('contract')
export class ContractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  status: ContractStatus;

  @Column({ type: 'boolean', default: true })
  renewable: boolean;

  @Column({ type: 'text', nullable: true })
  conditions: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'enum', enum: SubscriptionTier })
  subscriptionTier: SubscriptionTier;

  @ManyToOne(() => CompanyEntity, (company) => company.contracts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @OneToOne(() => QuoteEntity, (quote) => quote.linkedContract, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'originating_quote_id' })
  originatingQuote?: QuoteEntity | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'price',
  })
  price?: number;
}
