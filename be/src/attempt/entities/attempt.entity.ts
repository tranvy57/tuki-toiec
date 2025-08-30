import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Part } from 'src/part/entities/part.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('attempts')
export class Attempt extends BaseEntity {
  @Column({ name: 'started_at' })
  startedAt: Date;
  @Column({ name: 'finish_at', nullable: true })
  finishAt: Date;
  @Column({ name: 'total_score', nullable: true })
  totalScore: number;

  status: 'in_progress' | 'submitted';
  score: number;
  mode: 'practice' | 'test';

  @ManyToOne(() => User, (user) => user.attempts)
  user: User;

  @ManyToMany(() => Part, (part) => part.attempts)
  @JoinTable({
    name: 'aptempt_parts',
    joinColumn: {
      name: 'attempt_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'vocabulary_id',
      referencedColumnName: 'id',
    },
  })
  parts: Part[];

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.attempt)
  attemptAnswers: AttemptAnswer[];
}
