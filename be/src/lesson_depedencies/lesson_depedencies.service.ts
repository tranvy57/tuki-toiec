import { Injectable } from '@nestjs/common';
import { CreateLessonDepedencyDto } from './dto/create-lesson_depedency.dto';
import { UpdateLessonDepedencyDto } from './dto/update-lesson_depedency.dto';

@Injectable()
export class LessonDepedenciesService {
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
}
