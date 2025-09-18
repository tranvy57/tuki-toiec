import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonSkillsService } from './lesson_skills.service';
import { CreateLessonSkillDto } from './dto/create-lesson_skill.dto';
import { UpdateLessonSkillDto } from './dto/update-lesson_skill.dto';

@Controller('lesson-skills')
export class LessonSkillsController {
  constructor(private readonly lessonSkillsService: LessonSkillsService) {}

  @Post()
  create(@Body() createLessonSkillDto: CreateLessonSkillDto) {
    return this.lessonSkillsService.create(createLessonSkillDto);
  }

  @Get()
  findAll() {
    return this.lessonSkillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonSkillsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonSkillDto: UpdateLessonSkillDto) {
    return this.lessonSkillsService.update(+id, updateLessonSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonSkillsService.remove(+id);
  }
}
