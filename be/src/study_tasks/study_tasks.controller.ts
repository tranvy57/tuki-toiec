import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudyTasksService } from './study_tasks.service';
import { CreateStudyTaskDto } from './dto/create-study_task.dto';
import { UpdateStudyTaskDto } from './dto/update-study_task.dto';

@Controller('study-tasks')
export class StudyTasksController {
  constructor(private readonly studyTasksService: StudyTasksService) {}

  @Post()
  create(@Body() createStudyTaskDto: CreateStudyTaskDto) {
    return this.studyTasksService.create(createStudyTaskDto);
  }

  @Get()
  findAll() {
    return this.studyTasksService.findAll();
  }



  @Patch(':id')
  async updateStudyTask(
    @Param('id') id: string,
  ) {
    return this.studyTasksService.completeStudyTask(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyTasksService.remove(+id);
  }
}
