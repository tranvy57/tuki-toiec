import { BaseEntity } from 'src/common/entities/base.entity';
import { Item } from 'src/item/entities/item.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { LessonContent } from 'src/lesson_content/entities/lesson_content.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';


@Entity('lesson_content_items')
export class LessonContentItem extends BaseEntity {
  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @ManyToOne(() => LessonContent, (lessonContent) => lessonContent.lessonContentItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_content_id' })
  lessonContent: LessonContent;

  @ManyToOne(() => Item, (item) => item.lessonContentItems, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
