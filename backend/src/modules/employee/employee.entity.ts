import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CompanyEntity } from '../company/entities/company.entity';
import { ContractType } from '../../common/enum/contract-type.enum';
import { UserEntity } from '../../common/entity/user.entity';
import { BookingEntity } from '../../common/entity/booking.entity';
import { EvaluationEntity } from '../../common/entity/evaluation.entity';
import { EventEntity } from '../../common/entity/event.entity';
import { PostEntity } from '../../common/entity/post.entity';
import { CommentEntity } from '../../common/entity/comment.entity';
import { MessageEntity } from '../../common/entity/message.entity';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  address: string;

  @ManyToOne(
    () => CompanyEntity,
    (company: CompanyEntity) => company.employees,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 100, name: 'occupied_job' })
  occupied_job: string;

  @Column({ type: 'date', name: 'starting_date' })
  startingDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'varchar',
    default: 'CDI',
    name: 'contract_type',
  })
  contractType: ContractType;

  @OneToMany(() => BookingEntity, (booking: BookingEntity) => booking.employee)
  bookings: BookingEntity[];

  @OneToMany(
    () => EvaluationEntity,
    (evaluation: EvaluationEntity) => evaluation.ratedByEmployee,
  )
  evaluationsGiven: EvaluationEntity[];

  @ManyToMany(() => EventEntity, (event) => event.employees)
  events: EventEntity[];

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sender)
  messages: MessageEntity[];
}