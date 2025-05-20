import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeEntity } from '../../modules/employee/employee.entity';
import { CommentEntity } from './comment.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.posts)
  author: EmployeeEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
