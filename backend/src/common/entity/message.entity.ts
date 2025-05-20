import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { EmployeeService } from '../../modules/employee/employee.service'; // Optional, if you have chat rooms

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => EmployeeEntity, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: EmployeeEntity;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
