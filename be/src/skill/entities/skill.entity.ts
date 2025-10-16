import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { QuestionTag } from 'src/question_tags/entities/question_tag.entity';
import { TargetSkill } from 'src/target_skills/entities/target_skill.entity';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { Part } from 'src/part/entities/part.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => UserProgress, (up) => up.skill)
  userProgresses: UserProgress[];

  @OneToMany(() => QuestionTag, (questionTag) => questionTag.skill)
  questionTags: QuestionTag[];

  @OneToMany(() => TargetSkill, (targetSkill) => targetSkill.skill)
  targetSkills: TargetSkill[];

  @OneToMany(() => LessonSkill, (lessonSkill) => lessonSkill.skill)
  lessons: LessonSkill[];

  @ManyToMany(() => Part, (part) => part.skills)
  @JoinTable({
    name: 'skill_parts', // tên bảng join
    joinColumn: { name: 'skill_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'part_id', referencedColumnName: 'id' },
  })
  parts: Part[];

  @ManyToMany(() => Item, (item) => item.skills)
  items: Item[];
}
