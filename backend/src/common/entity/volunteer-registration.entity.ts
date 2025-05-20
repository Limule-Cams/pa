import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { VolunteeringActivityEntity } from './volunteering-activity.entity';

@Entity('volunteer_registration')
@Unique(['employee', 'activity'])
export class VolunteerRegistrationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EmployeeEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity;

    @ManyToOne(() => VolunteeringActivityEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'activity_id' })
    activity: VolunteeringActivityEntity;

    @CreateDateColumn({ name: 'registration_date' })
    registrationDate: Date;

    // Optionnel: Statut (inscrit, participé, annulé...)
    // @Column({ type: 'enum', enum: VolunteerStatus, default: VolunteerStatus.REGISTERED })
    // status: VolunteerStatus;
}