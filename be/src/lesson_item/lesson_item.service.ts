import { Injectable } from '@nestjs/common';
import { CreateLessonItemDto } from './dto/create-lesson_item.dto';
import { UpdateLessonItemDto } from './dto/update-lesson_item.dto';

@Injectable()
export class LessonItemService {
  create(createLessonItemDto: CreateLessonItemDto) {
    return 'This action adds a new lessonItem';
  }

  findAll() {
    return `This action returns all lessonItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonItem`;
  }

  update(id: number, updateLessonItemDto: UpdateLessonItemDto) {
    return `This action updates a #${id} lessonItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonItem`;
  }
}
