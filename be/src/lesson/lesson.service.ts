import { Inject, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Question } from 'src/question/entities/question.entity';
import { Lesson } from './entities/lesson.entity';
import { DataSource } from 'typeorm';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { LessonWithItemsDto } from './dto/lesson-items.dto';

@Injectable()
export class LessonService {
  constructor(private readonly dataSrc: DataSource) {}

  CHUNK_SIZE: number = 10; // Số câu hỏi mỗi lesson

  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lesson';
  }

  findAll() {
    return `This action returns all lesson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }

  async findLessonsByModality(
    modality: string,
    skillType?: string,
  ): Promise<LessonWithItemsDto[]> {
    const qb = this.dataSrc
      .getRepository('Lesson')
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.contents', 'lc')
      .leftJoinAndSelect('lc.lessonContentItems', 'lci')
      .leftJoinAndSelect('lci.item', 'i')
      .where('l.type = :type', { type: 'exercise' })
      .andWhere('i.modality = :modality', { modality });

    if (skillType) {
      qb.andWhere('i.skillType = :skillType', {
        skillType,
      });
    }

    const lessons = await qb.getMany();
    lessons.map((x) => console.log(x));

    return lessons.map((lesson: any) => ({
      lessonId: lesson.id,
      name: lesson.name,
      items: (lesson.contents ?? [])
        .flatMap((c) => c.lessonContentItems ?? [])
        .map((ci) => ({
          id: ci.item.id,
          modality: ci.item.modality,
          title: ci.item.title,
          bandHint: ci.item.bandHint,
          difficulty: ci.item.difficulty,
          promptJsonb: ci.item.promptJsonb,
          solutionJsonb: ci.item.solutionJsonb,
        })),
    }));
  }
}
