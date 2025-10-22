import Joi from 'joi';
import { Answer } from 'src/answers/entities/answer.entity';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Grammar } from 'src/grammar/entities/grammar.entity';
import { Group } from 'src/group/entities/group.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { QuestionTag } from 'src/question_tags/entities/question_tag.entity';
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
  @Column('text', { name: 'phrases', array: true, nullable: true })
  phrases: string[];

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

  @ManyToMany(() => Vocabulary, (vocabulary) => vocabulary.questions)
  @JoinTable({
    name: 'question_vocabularies',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'vocabulary_id',
      referencedColumnName: 'id',
    },
  })
  vocabularies: Vocabulary[];

  @OneToMany(() => AttemptAnswer, (attemptAnswer) => attemptAnswer.question)
  attemptAnswers: AttemptAnswer[];

  @OneToMany(() => QuestionTag, (questionTag) => questionTag.question)
  questionTags: QuestionTag[];
}
