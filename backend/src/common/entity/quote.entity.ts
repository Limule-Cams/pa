import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { CompanyEntity } from '../../modules/company/entities/company.entity';
import { ContractEntity } from './contract.entity'; 
import { QuoteStatus } from '../enum/quote-status.enum';
import { SubscriptionTier } from '../enum/subscription-tier.enum';

@Entity('quote')
export class QuoteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true, name: 'quote_number' })
    quoteNumber: string; 

    @ManyToOne(() => CompanyEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'company_id' })
    company?: CompanyEntity | null;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'contact_name' })
    contactName?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'contact_email' })
    contactEmail?: string;

    @Column({ type: 'int', name: 'number_of_employees' })
    numberOfEmployees: number;

    @Column({ type: 'enum', enum: SubscriptionTier, name: 'calculated_tier' })
    calculatedTier: SubscriptionTier;

    @Column({ type: 'enum', enum: SubscriptionTier, nullable: true, name: 'requested_tier' })
    requestedTier?: SubscriptionTier;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'annual_price_per_employee' })
    annualPricePerEmployee: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, name: 'estimated_annual_total' })
    estimatedAnnualTotal: number;

    @Column({ type: 'text', nullable: true }) 
    details?: string;

    @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.PENDING })
    status: QuoteStatus;

    @Column({ type: 'date', nullable: true, name: 'valid_until' })
    validUntil?: Date;

    @OneToOne(() => ContractEntity, contract => contract.originatingQuote, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'linked_contract_id' })
    linkedContract?: ContractEntity | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}