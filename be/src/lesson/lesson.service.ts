import { Inject, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Question } from 'src/question/entities/question.entity';
import { Lesson } from './entities/lesson.entity';
import { DataSource } from 'typeorm';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';

@Injectable()
export class LessonService {
  constructor(
    private readonly dataSrc: DataSource,
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

}  
