import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AssociationEntity } from './association.entity';
import { VolunteerRegistrationEntity } from './volunteer-registration.entity';

@Entity('volunteering_activity')
export class VolunteeringActivityEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AssociationEntity, assoc => assoc.volunteeringActivities, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'association_id' })
    association: AssociationEntity;

    @Column({ type: 'varchar', length: 255 })
    name: string; 

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'datetime' })
    date: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location?: string;

    @Column({ type: 'text', nullable: true, name: 'required_skills' })
    requiredSkills?: string;

    @Column({ default: true })
    isActive: boolean; 

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => VolunteerRegistrationEntity, registration => registration.activity)
    volunteerRegistrations: VolunteerRegistrationEntity[];
}