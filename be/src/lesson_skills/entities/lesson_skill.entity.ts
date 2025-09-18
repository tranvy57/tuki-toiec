import { BaseEntity } from 'src/common/entities/base.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('lesson_skills')
export class LessonSkill extends BaseEntity {
  @ManyToOne(() => Lesson, (lesson) => lesson.skills)
  @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
  lesson: Lesson;

  @ManyToOne(() => Skill, (skill) => skill.lessons)
  @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
  skill: Skill;

  @Column({ type: 'float', default: 0 })
  weight: number;
}
