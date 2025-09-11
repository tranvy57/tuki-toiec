import Joi from 'joi';
import { Answer } from 'src/answers/entities/answer.entity';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Grammar } from 'src/grammar/entities/grammar.entity';
import { Group } from 'src/group/entities/group.entity';
import { QuestionTag } from 'src/question_tags/entities/question_tag.entity';
import { QuestionVocabulary } from 'src/question_vocabularies/entities/question_vocabulary.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('questions')
export class Question extends BaseEntity {
  @Column({ name: 'number_label' })
  numberLabel: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ default: '' })
  explanation?: string;

  @Column({ default: 5 })
  score: number;

  @Column('text', { name: 'lemmas', array: true, nullable: true })
  lemmas: string[];

  @ManyToOne(() => Group, (group) => group.questions)
  group: Group;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToMany(() => Grammar, (grammar) => grammar.questions)
  @JoinTable({
    name: 'question_grammars',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'grammar_id',
      referencedColumnName: 'id',
    },
  })
  grammars: Grammar[];

  @OneToMany(() => QuestionVocabulary, (qv) => qv.question)
  questionVocabularies: QuestionVocabulary[];

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.question)
  attemptAnswers: AttemptAnswer[];

  @OneToMany(() => QuestionTag, (questionTag) => questionTag.question)
  questionTags: QuestionTag[];
}
