import { BaseEntity } from 'src/common/entities/base.entity';
import { Part } from 'src/part/entities/part.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('groups')
export class Group extends BaseEntity {
  @Column({ name: 'order_index' })
  orderIndex: number;

  @Column({ name: 'parageraph_en' })
  paragraphEn: string;

  @Column({ name: 'paragraph_vn' })
  paragraphVn: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl: string;

  @OneToMany(() => Question, (question) => question.group)
  questions: Question[];

  @ManyToOne(() => Part, (part) => part.groups)
  part: Part;
}
