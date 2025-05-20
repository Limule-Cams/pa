import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VolunteeringActivityEntity } from './volunteering-activity.entity';
import { DonationEntity } from './donation.entity';

@Entity('association')
export class AssociationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    website?: string;

    @Column({ type: 'varchar', length: 500, nullable: true, name: 'logo_url' })
    logoUrl?: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => VolunteeringActivityEntity, activity => activity.association)
    volunteeringActivities: VolunteeringActivityEntity[];

    @OneToMany(() => DonationEntity, donation => donation.association)
    donationsReceived: DonationEntity[];
}