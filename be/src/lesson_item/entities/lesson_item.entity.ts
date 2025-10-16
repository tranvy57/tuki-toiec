import { BaseEntity } from 'src/common/entities/base.entity';
import { Item } from 'src/item/entities/item.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';


@Entity('lesson_items')
export class LessonItem extends BaseEntity {
  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @ManyToOne(() => Item, (item) => item.lessonItems, {
    eager: true, 
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
