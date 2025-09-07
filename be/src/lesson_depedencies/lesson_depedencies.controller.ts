import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonDepedenciesService } from './lesson_depedencies.service';
import { CreateLessonDepedencyDto } from './dto/create-lesson_depedency.dto';
import { UpdateLessonDepedencyDto } from './dto/update-lesson_depedency.dto';

@Controller('lesson-depedencies')
export class LessonDepedenciesController {
  constructor(private readonly lessonDepedenciesService: LessonDepedenciesService) {}

  @Post()
  create(@Body() createLessonDepedencyDto: CreateLessonDepedencyDto) {
    return this.lessonDepedenciesService.create(createLessonDepedencyDto);
  }

  @Get()
  findAll() {
    return this.lessonDepedenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonDepedenciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDepedencyDto: UpdateLessonDepedencyDto) {
    return this.lessonDepedenciesService.update(+id, updateLessonDepedencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonDepedenciesService.remove(+id);
  }
}
