import { BaseEntity } from 'src/common/entities/base.entity';
import { Question } from 'src/question/entities/question.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('question_vocabularies')
export class QuestionVocabulary extends BaseEntity {
  @ManyToOne(() => Question, (question) => question.questionVocabularies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Vocabulary, (vocab) => vocab.questionVocabularies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;

  @Column({ name: 'is_focus', default: false })
  isFocus: boolean;

  @Column({ type: 'float', nullable: true })
  weight: number;
}
