import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonItemService } from './lesson_item.service';
import { CreateLessonItemDto } from './dto/create-lesson_item.dto';
import { UpdateLessonItemDto } from './dto/update-lesson_item.dto';

@Controller('lesson-item')
export class LessonItemController {
  constructor(private readonly lessonItemService: LessonItemService) {}

  @Post()
  create(@Body() createLessonItemDto: CreateLessonItemDto) {
    return this.lessonItemService.create(createLessonItemDto);
  }

  @Get()
  findAll() {
    return this.lessonItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonItemDto: UpdateLessonItemDto) {
    return this.lessonItemService.update(+id, updateLessonItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonItemService.remove(+id);
  }
}
