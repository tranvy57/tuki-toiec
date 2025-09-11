import { BaseEntity } from 'src/common/entities/base.entity';
import { Question } from 'src/question/entities/question.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity('vocabularies')
export class Vocabulary extends BaseEntity {
  @Column()
  word: string;

  @Column()
  meaning: string;

  @Column()
  pronunciation: string;

  @Column({ name: 'part_of_speech' })
  partOfSpeech: string;

  @Column({ name: 'example_en' })
  exampleEn: string;

  @Column({ name: 'example_vn' })
  exampleVn: string;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl: string;

  @Column({ name: 'lemma', nullable: true })
  lemma: string;

  @OneToMany(() => UserVocabulary, (uv) => uv.vocabulary)
  userVocabularies: UserVocabulary[];

  @ManyToMany(() => Question, (question) => question.vocabularies)
  questions: Question[];
}
