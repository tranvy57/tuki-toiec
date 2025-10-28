import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { UserVocabularySession } from 'src/user_vocabulary_session/entities/user_vocabulary_session.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

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

  @Column({ name: 'correct_rate', type: 'float', default: 0 })
  correctRate: number;

  @Column({ type: 'float', default: 0 })
  strength: number; // 0–1: độ ghi nhớ

  @Column({ name: 'times_reviewed', default: 0 })
  timesReviewed: number;

  @Column({ name: 'last_reviewed_at', type: 'timestamp', nullable: true })
  lastReviewedAt: Date;

  @Column({ name: 'next_review_at', type: 'timestamp', nullable: true })
  nextReviewAt: Date;

  @Column({ default: 'learning' })
  learningStage: 'new' | 'learning' | 'mastered' | 'forgotten';

  @Column({ name: 'source', nullable: true })
  source?: 'lesson' | 'search' | 'ai_recommendation' | 'import';

  @Column({ name: 'difficulty_score', type: 'float', nullable: true })
  difficultyScore: number;

  @Column({ name: 'is_bookmarked', type: 'boolean', default: false })
  isBookmarked: boolean;

  @OneToMany(() => UserVocabularySession, (session) => session.userVocabulary)
  sessions: UserVocabularySession[];
}
