import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => User, (user) => user.vocabularies)
  users?: User[];
}
