import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProviderEntity } from '../../modules/provider/provider.entity';

@Entity('certification')
export class CertificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  industry: string;

  @Column({ type: 'varchar', length: 255, name: 'issuing_authority' })
  issuingAuthority: string;

  @Column({ type: 'date', name: 'issue_date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true, name: 'expiry_date' })
  expiryDate: Date | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'document_url',
  })
  documentUrl: string;

  @ManyToOne(() => ProviderEntity, (provider) => provider.certifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: ProviderEntity;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;
}