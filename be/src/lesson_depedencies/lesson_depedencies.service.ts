import { Injectable } from '@nestjs/common';
import { CreateLessonDepedencyDto } from './dto/create-lesson_depedency.dto';
import { UpdateLessonDepedencyDto } from './dto/update-lesson_depedency.dto';
import { DataSource } from 'typeorm';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { LessonDependency } from './entities/lesson_depedency.entity';



@Injectable()
export class LessonDepedenciesService {
  constructor(
    private readonly dataSrc: DataSource,
  ) {}

  skillOrder: [string, string][] = [
    ['G1', 'R1'],
    ['R1', 'R2'],
    ['R2', 'R3'],
    ['R3', 'R4'],
    ['L1', 'L2a'],
    ['L2a', 'L2b'],
    ['L2b', 'L2c'],
    ['L2c', 'L2d'],
    ['L2d', 'L3'],
    ['L3', 'L4'],
  ];
  
  create(createLessonDepedencyDto: CreateLessonDepedencyDto) {
    return 'This action adds a new lessonDepedency';
  }

  findAll() {
    return `This action returns all lessonDepedencies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonDepedency`;
  }

  update(id: number, updateLessonDepedencyDto: UpdateLessonDepedencyDto) {
    return `This action updates a #${id} lessonDepedency`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonDepedency`;
  }

  async seedLessonDependencies(
    lessonsBySkill: Map<string, Lesson[]>, // đã tạo từ seedLessons
  ) {
    const depRepo = this.dataSrc.getRepository(LessonDependency);

    // 1. Micro dependency: trong cùng skill
    for (const lessons of lessonsBySkill.values()) {
      for (let i = 0; i < lessons.length - 1; i++) {
        await depRepo.save(
          depRepo.create({
            lessonBefore: { id: lessons[i].id } as Lesson,
            lesson: { id: lessons[i + 1].id } as Lesson,
            minProficiency: 0.6,
          }),
        );
      }
    }

    // 2. Macro dependency: giữa các skill
    for (const [beforeSkill, afterSkill] of this.skillOrder) {
      const beforeLessons = lessonsBySkill.get(beforeSkill) || [];
      const afterLessons = lessonsBySkill.get(afterSkill) || [];
      if (beforeLessons.length && afterLessons.length) {
        await depRepo.save(
          depRepo.create({
            lessonBefore: { id: beforeLessons.at(-1)!.id } as Lesson, // lesson cuối skill trước
            lesson: { id: afterLessons[0].id } as Lesson, // lesson đầu skill sa
          }),
        );
      }
    }

    console.log('✅ Seed lesson_dependencies done!');
  }
}
