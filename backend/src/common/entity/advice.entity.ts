import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('advice') 
export class AdviceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    summary: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    category?: string;

    @Column({ type: 'varchar', length: 500, nullable: true, name: 'content_url' })
    contentUrl?: string; 

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'publication_date' })
    publicationDate: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}