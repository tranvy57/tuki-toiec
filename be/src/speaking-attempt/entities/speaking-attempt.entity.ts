import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('speaking_attempts')
export class SpeakingAttempt extends BaseEntity {
  @ManyToOne(() => User, (user) => user.speakingAttempts, {
    onDelete: 'CASCADE', 
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text')
  transcript: string;

  @Column('float')
  pronunciation: number;

  @Column('float')
  fluency: number;

  @Column('float')
  grammar: number;

  @Column('float')
  vocabulary: number;

  @Column('float')
  task: number;

  @Column('float')
  overall: number;

  @Column('text', { nullable: true })
  audioUrl: string;
}
