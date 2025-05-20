import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { AssociationEntity } from './association.entity';
import { DonationType } from '../enum/donation-type.enum';

@Entity('donation')
export class DonationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EmployeeEntity, { nullable: false, onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;

    @ManyToOne(() => AssociationEntity, { nullable: false, onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'association_id' })
    association: AssociationEntity;

    @Column({ type: 'enum', enum: DonationType })
    type: DonationType;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) 
    amount?: number;

    @Column({ type: 'text', nullable: true }) 
    description?: string;

    @CreateDateColumn({ name: 'donation_date' })
    donationDate: Date;

    // Optionnel: Ajouter un statut si un processus de validation/réception est nécessaire
    // @Column({ type: 'enum', enum: DonationStatus, default: DonationStatus.PENDING })
    // status: DonationStatus;
}