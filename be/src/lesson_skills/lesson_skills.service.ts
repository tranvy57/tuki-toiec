import { Injectable } from '@nestjs/common';
import { CreateLessonSkillDto } from './dto/create-lesson_skill.dto';
import { UpdateLessonSkillDto } from './dto/update-lesson_skill.dto';

@Injectable()
export class LessonSkillsService {
  create(createLessonSkillDto: CreateLessonSkillDto) {
    return 'This action adds a new lessonSkill';
  }

  findAll() {
    return `This action returns all lessonSkills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonSkill`;
  }

  update(id: number, updateLessonSkillDto: UpdateLessonSkillDto) {
    return `This action updates a #${id} lessonSkill`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonSkill`;
  }




}
