import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Part } from 'src/part/entities/part.entity';
import { Test } from 'src/test/entities/test.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('attempts')
export class Attempt extends BaseEntity {
  @Column({ name: 'started_at' })
  startedAt: Date;
  @Column({ name: 'finish_at', nullable: true })
  finishAt: Date;
  @Column({ name: 'total_score', nullable: true })
  totalScore: number;
  @Column()
  status: 'in_progress' | 'submitted';
  @Column({ nullable: true })
  score: number;
  @Column()
  mode: 'practice' | 'test';

  @ManyToOne(() => User, (user) => user.attempts)
  user: User;

  @ManyToMany(() => Part, (part) => part.attempts)
  @JoinTable({
    name: 'attempt_parts',
    joinColumn: {
      name: 'attempt_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'part_id',
      referencedColumnName: 'id',
    },
  })
  parts: Part[];

  @ManyToOne(() => Test, (test) => test.attempts)
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.attempt)
  attemptAnswers: AttemptAnswer[];
}
