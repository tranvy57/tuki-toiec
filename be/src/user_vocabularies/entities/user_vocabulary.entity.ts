import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_vocabularies')
export class UserVocabulary extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userVocabularies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Vocabulary, (vocab) => vocab.userVocabularies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;

  @Column({ name: 'wrong_count', default: 0 })
  wrongCount: number;

  @Column({ name: 'correct_count', default: 0 })
  correctCount: number;

  @Column({ default: 'active' })
  status: string;
}
