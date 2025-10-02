import { Injectable } from '@nestjs/common';
import { CreateLessonContentDto } from './dto/create-lesson_content.dto';
import { UpdateLessonContentDto } from './dto/update-lesson_content.dto';

@Injectable()
export class LessonContentService {
  create(createLessonContentDto: CreateLessonContentDto) {
    return 'This action adds a new lessonContent';
  }

  findAll() {
    return `This action returns all lessonContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonContent`;
  }

  update(id: number, updateLessonContentDto: UpdateLessonContentDto) {
    return `This action updates a #${id} lessonContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonContent`;
  }
}
