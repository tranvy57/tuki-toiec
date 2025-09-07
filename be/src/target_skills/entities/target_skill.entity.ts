import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Skill } from 'src/skill/entities/skill.entity';

@Entity('target_skills')
@Unique('UQ_target_per_plan_skill', ['plan', 'skill'])
export class TargetSkill extends BaseEntity {
  @ManyToOne(() => Plan, (p) => p.targetSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
  @Index()
  plan: Plan;

  @ManyToOne(() => Skill, (s) => s.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
  @Index()
  skill: Skill;

  @Column({ type: 'float' })
  proficiency: number; // 0..1
}
