import { Test, TestingModule } from '@nestjs/testing';
import { StudyTasksController } from './study_tasks.controller';
import { StudyTasksService } from './study_tasks.service';

describe('StudyTasksController', () => {
  let controller: StudyTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyTasksController],
      providers: [StudyTasksService],
    }).compile();

    controller = module.get<StudyTasksController>(StudyTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
