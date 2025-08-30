import { Attempt } from 'src/attempt/entities/attempt.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Test } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity('parts')
export class Part extends BaseEntity {
  @Column({ name: 'part_number' })
  partNumber: number;

  direation: string;

  @ManyToOne(() => Test, (test) => test.parts)
  test: Test;

  @ManyToMany(() => Attempt, (attempt) => attempt.parts)
  attempts: Attempt[];
}
