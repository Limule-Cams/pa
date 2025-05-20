import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReportStatus } from '../enum/report-status.enum'; 

@Entity('anonymous_report')
export class ReportEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string; 

    @CreateDateColumn({ name: 'reported_at' })
    reportedAt: Date; 

    @UpdateDateColumn({ name: 'updated_at' }) 
    updatedAt: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    category?: string;

    @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.NEW }) 
    status: ReportStatus; 

    //PAS DE LIEN VERS UserEntity ou EmployeeEntity ici pour garantir l'anonymat
}