// src/common/entity/question-answer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Youtube')
export class QuestionAnswerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    @Index({ fulltext: true })
    question: string; 

    @Column({ type: 'text', nullable: true })
    keywords: string; 

    @Column({ type: 'text' })
    answer: string;

    @Column({ default: true })
    isActive: boolean; 

    @Column({ default: 0 })
    priority: number; 

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Optionnel: Catégorie, Tags, etc.
    // @Column({ type: 'varchar', length: 100, nullable: true })
    // category: string;
}