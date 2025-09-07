import { BaseEntity } from 'src/common/entities/base.entity';
import { Question } from 'src/question/entities/question.entity';
import { Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity('grammars')
export class Grammar extends BaseEntity {
  title: string;
  content: string;
  example: string;

  @ManyToMany(() => Question, (question) => question.vocabularies)
  questions: Question[];
}
