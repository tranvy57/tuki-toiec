import { BaseEntity } from "src/common/entities/base.entity";
import { UserVocabulary } from "src/user_vocabularies/entities/user_vocabulary.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('user_vocabulary_sessions')
export class UserVocabularySession extends BaseEntity {
  @ManyToOne(() => UserVocabulary, (uv) => uv.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_vocab_id' })
  userVocabulary: UserVocabulary;

  @Column({ type: 'boolean', nullable: true })
  correct: boolean;

  @Column({
    name: 'reviewed_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  reviewedAt: Date;

  @Column({ name: 'source', nullable: true })
  source?: 'practice' | 'lesson' | 'test';

  @Column({ name: 'strength_before', type: 'float', nullable: true })
  strengthBefore?: number;

  @Column({ name: 'strength_after', type: 'float', nullable: true })
  strengthAfter?: number;
}
