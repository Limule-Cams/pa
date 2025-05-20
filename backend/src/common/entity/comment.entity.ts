import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { EmployeeEntity } from '../../modules/employee/employee.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.comments)
  author: EmployeeEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
