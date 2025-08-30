import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhaseLessonsService } from './phase_lessons.service';
import { CreatePhaseLessonDto } from './dto/create-phase_lesson.dto';
import { UpdatePhaseLessonDto } from './dto/update-phase_lesson.dto';

@Controller('phase-lessons')
export class PhaseLessonsController {
  constructor(private readonly phaseLessonsService: PhaseLessonsService) {}

  @Post()
  create(@Body() createPhaseLessonDto: CreatePhaseLessonDto) {
    return this.phaseLessonsService.create(createPhaseLessonDto);
  }

  @Get()
  findAll() {
    return this.phaseLessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phaseLessonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseLessonDto: UpdatePhaseLessonDto) {
    return this.phaseLessonsService.update(+id, updatePhaseLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phaseLessonsService.remove(+id);
  }
}
