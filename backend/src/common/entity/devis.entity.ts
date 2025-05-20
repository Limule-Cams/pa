import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('devis')
export class DevisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'max_employees' })
  maxEmployees: number;

  @Column({ name: 'included_activities' })
  includedActivities: number;

  @Column({ name: 'included_appointments' })
  includedAppointments: number;

  @Column({
    name: 'additional_appointment_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  additionalAppointmentPrice: number;

  @Column({
    name: 'chatbot_access',
    type: 'enum',
    enum: ['limited', 'unlimited'],
  })
  chatbotAccess: 'limited' | 'unlimited';

  @Column({ name: 'chatbot_questions', nullable: true })
  chatbotQuestions?: number;

  @Column({ name: 'weekly_advice', default: false })
  weeklyAdvice: boolean;

  @Column({ name: 'personalized_advice', default: false })
  personalizedAdvice: boolean;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
