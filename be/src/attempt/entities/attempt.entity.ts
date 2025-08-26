import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('attempts')
export class Attempt extends BaseEntity {
  @Column({ name: 'started_at' })
  startedAt: Date;
  @Column({ name: 'finish_at', nullable: true })
  finishAt: Date;
  @Column({ name: 'total_score', nullable: true })
  totalScore: number;

  status: 'in_progress' | 'submitted';
  score: number;
  mode: 'practice' | 'test';

  @ManyToOne(() => User, (user) => user.attempts)
  user: User;
}
