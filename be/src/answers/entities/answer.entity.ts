import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('answers')
export class Answer extends BaseEntity {
  @Column()
  content: string;
  @Column({ name: 'is_correct' })
  isCorrect: boolean;

  @Column({ name: 'answer_key' })
  answerKey: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.answer)
  attemptAnswers?: AttemptAnswer[];
}
