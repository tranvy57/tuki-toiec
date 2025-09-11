import { Answer } from 'src/answers/entities/answer.entity';
import { Attempt } from 'src/attempt/entities/attempt.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity('attempt_answers')
export class AttemptAnswer extends BaseEntity {
  @ManyToOne(() => Attempt, (a) => a.attemptAnswers, { onDelete: 'CASCADE' })
  @Index()
  attempt: Attempt;

  @ManyToOne(() => Question, (q) => q.attemptAnswers, { onDelete: 'CASCADE' })
  @Index()
  question: Question;

  @ManyToOne(() => Answer, (ans) => ans.attemptAnswers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  answer?: Answer | null;

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect?: boolean | null;
}
