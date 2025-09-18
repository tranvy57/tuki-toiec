import { Inject, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Question } from 'src/question/entities/question.entity';
import { Lesson } from './entities/lesson.entity';
import { DataSource } from 'typeorm';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { LessonDepedenciesService } from 'src/lesson_depedencies/lesson_depedencies.service';

@Injectable()
export class LessonService {
  constructor(
    private readonly dataSrc: DataSource,
    @Inject()
    private readonly lessonDepedenciesService: LessonDepedenciesService,
  ) {}

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

  async seedLessons() {
    const questionRepo = this.dataSrc.getRepository(Question);
    const lessonRepo = this.dataSrc.getRepository(Lesson);
    const lsRepo = this.dataSrc.getRepository(LessonSkill);

    const questions = await questionRepo.find({
      relations: { questionTags: { skill: true } },
    });

    // Gom câu hỏi theo skillId (vẫn giữ skillCode để hiển thị)
    const questionsBySkill = new Map<
      string, // skillId
      { code: string; questions: Question[] }
    >();

    for (const q of questions) {
      for (const tag of q.questionTags) {
        const skillId = tag.skill.id;
        const skillCode = tag.skill.code;
        if (!questionsBySkill.has(skillId)) {
          questionsBySkill.set(skillId, { code: skillCode, questions: [] });
        }
        questionsBySkill.get(skillId)!.questions.push(q);
      }
    }

    const lessonsBySkill = new Map<string, Lesson[]>(); // skillId -> lessons

    for (const [
      skillId,
      { code: skillCode, questions: qs },
    ] of questionsBySkill.entries()) {
      qs.sort(() => Math.random() - 0.5); // shuffle

      let lessonIndex = 1;
      const createdLessons: Lesson[] = [];

      for (let i = 0; i < qs.length; i += this.CHUNK_SIZE) {
        const chunk = qs.slice(i, i + this.CHUNK_SIZE);

        // Lesson hiển thị: dùng skillCode
        const lesson = lessonRepo.create({
          name: `${skillCode} - Lesson ${lessonIndex}`,
          description: `Practice for ${skillCode}`,
          order: lessonIndex,
        });
        await lessonRepo.save(lesson);

        // Gắn câu hỏi vào lesson
        lesson.questions = chunk;
        await lessonRepo.save(lesson);

        // Tính weight
        const skillCount = chunk.filter((q) =>
          q.questionTags.some((t) => t.skill.id === skillId),
        ).length;
        const weight = skillCount / chunk.length;

        // Lưu quan hệ lesson ↔ skill bằng skillId
        await lsRepo.save(
          lsRepo.create({
            lesson: { id: lesson.id } as any,
            skill: { id: skillId } as any,
            weight,
          }),
        );

        createdLessons.push(lesson);
        lessonIndex++;
      }

      lessonsBySkill.set(skillId, createdLessons);
    }

    // Gọi seed dependency
    this.lessonDepedenciesService.seedLessonDependencies(lessonsBySkill);

    return lessonsBySkill;
  }
}  
