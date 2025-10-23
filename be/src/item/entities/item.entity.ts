import {
  Check,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { CourseBand } from 'src/courses/consts';
import { LessonContentItem } from 'src/lesson_item/entities/lesson_item.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import type { ItemModality, ItemStatus } from '../schema/item.type';
import { ITEM_MODALITIES, ITEM_STATUS } from '../schema/item.type';

@Entity('items')
@Index(['modality', 'status'])
@Check(`modality IN ('${ITEM_MODALITIES.join("','")}')`)
@Check(`status IN ('${ITEM_STATUS.join("','")}')`)
export class Item extends BaseEntity {
  @Column({ name: 'modality', type: 'varchar' })
  modality: ItemModality;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ name: 'status', type: 'varchar', default: 'draft' })
  status: ItemStatus;

  @Column({ name: 'prompt_jsonb', type: 'jsonb', default: {} })
  promptJsonb: Record<string, any>;

  @Column({ name: 'solution_jsonb', type: 'jsonb', default: {} })
  solutionJsonb: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @Column({ name: 'skill_type', nullable: true })
  skillType?: string;

  @Column({
    type: 'enum',
    name: 'band_hint',
    enum: CourseBand,
    nullable: true,
  })
  bandHint?: CourseBand;

  @Column({ name: 'difficulty', type: 'varchar', nullable: true })
  difficulty?: 'easy' | 'medium' | 'hard';

  @Column({ name: 'rubric_jsonb', type: 'jsonb', default: {} })
  rubricJsonb: Record<string, any>;

  @ManyToMany(() => Skill, (skill) => skill.items)
  @JoinTable({
    name: 'item_skills',
    joinColumn: { name: 'item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => LessonContentItem, (li) => li.item)
  lessonContentItems: LessonContentItem[];

  @Column({ name: 'question_ref', type: 'uuid', nullable: true })
  questionRef?: string;
}
