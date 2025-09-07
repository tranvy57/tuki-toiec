import { Injectable } from '@nestjs/common';
import { CreateStudyTaskDto } from './dto/create-study_task.dto';
import { UpdateStudyTaskDto } from './dto/update-study_task.dto';

@Injectable()
export class StudyTasksService {
  create(createStudyTaskDto: CreateStudyTaskDto) {
    return 'This action adds a new studyTask';
  }

  findAll() {
    return `This action returns all studyTasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studyTask`;
  }

  update(id: number, updateStudyTaskDto: UpdateStudyTaskDto) {
    return `This action updates a #${id} studyTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} studyTask`;
  }
}
