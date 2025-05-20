import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProviderEntity } from '../../modules/provider/provider.entity';
import { CompanyEntity } from '../../modules/company/entities/company.entity';
import { InvoiceStatus } from '../enum/invoice-status.enum';

@Entity('invoice')
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ type: 'date', name: 'invoice_date' })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true, name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @ManyToOne(() => ProviderEntity, (provider) => provider.invoices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'provider_id' })
  provider?: ProviderEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.invoicesReceived, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'company_id' })
  company?: CompanyEntity;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'total_amount',
  })
  totalAmount: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'payment_reference',
  })
  paymentReference: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'document_url',
  })
  documentUrl: string;
}