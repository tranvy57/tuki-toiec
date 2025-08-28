import { BaseEntity } from 'src/common/entities/base.entity';
import { Part } from 'src/part/entities/part.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('tests')
export class Test extends BaseEntity {
  title: string;
  @Column({ name: 'audio_url' })
  audioUrl: string;

  @OneToMany(() => Part, (part) => part.test)
  parts: Part[];
}
