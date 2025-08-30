import { Injectable } from '@nestjs/common';
import { CreatePhaseLessonDto } from './dto/create-phase_lesson.dto';
import { UpdatePhaseLessonDto } from './dto/update-phase_lesson.dto';

@Injectable()
export class PhaseLessonsService {
  create(createPhaseLessonDto: CreatePhaseLessonDto) {
    return 'This action adds a new phaseLesson';
  }

  findAll() {
    return `This action returns all phaseLessons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phaseLesson`;
  }

  update(id: number, updatePhaseLessonDto: UpdatePhaseLessonDto) {
    return `This action updates a #${id} phaseLesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} phaseLesson`;
  }
}
