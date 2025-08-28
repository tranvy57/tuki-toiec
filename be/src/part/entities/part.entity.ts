import { BaseEntity } from 'src/common/entities/base.entity';
import { Test } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('parts')
export class Part extends BaseEntity {
  @Column({ name: 'part_number' })
  partNumber: number;

  direation: string;

  @ManyToOne(() => Test, (test) => test.parts)
  test: Test;
}
                 