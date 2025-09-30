import { Attempt } from 'src/attempt/entities/attempt.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Group } from 'src/group/entities/group.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { Test } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('parts')
export class Part extends BaseEntity {
  @Column({ name: 'part_number' })
  partNumber: number;

  @Column({ default: '' })
  direction?: string;

  @ManyToOne(() => Test, (test) => test.parts)
  test: Test;

  @ManyToMany(() => Attempt, (attempt) => attempt.parts)
  attempts: Attempt[];

  @OneToMany(() => Group, (group) => group.part)
  groups: Group[];

  @ManyToMany(() => Skill, (skill) => skill.parts)
  skills: Skill[];
}
