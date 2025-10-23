import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { LessonContentItem } from 'src/lesson_item/entities/lesson_item.entity';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';

export enum LessonContentType {
  VIDEO = 'video', // Video hướng dẫn
  THEORY = 'theory', // Giải thích lý thuyết/ngữ pháp
  STRATEGY = 'strategy', // Mẹo làm bài
  VOCABULARY = 'vocabulary', // Từ vựng
  QUIZ = 'quiz', // Bài tập/quiz
  EXPLANATION = 'explanation', // Giải thích chi tiết bài tập
}

@Entity('lesson_contents')
export class LessonContent extends BaseEntity {
  @ManyToOne(() => Lesson, (lesson) => lesson.contents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
  lesson: Lesson;

  @Column({
    type: 'enum',
    enum: LessonContentType,
  })
  type: LessonContentType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @OneToMany(() => LessonContentItem, (li) => li.lessonContent, {
    cascade: true,
  })
  lessonContentItems: LessonContentItem[];

  @OneToMany(() => StudyTask, (st) => st.lessonContent, {
    cascade: true,
  })
  studyTasks: StudyTask[];

  @ManyToMany(() => Vocabulary)
  @JoinTable({
    name: 'lesson_content_vocabularies',
    joinColumn: { name: 'lesson_content_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vocab_id', referencedColumnName: 'id' },
  })
  vocabularies?: Vocabulary[];
}
