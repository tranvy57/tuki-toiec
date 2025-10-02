import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

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
  content: string; // nội dung text/markdown hoặc URL video

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean; // true = chỉ user trả phí mới xem được
}
