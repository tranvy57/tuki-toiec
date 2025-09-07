import { Test, TestingModule } from '@nestjs/testing';
import { StudyTasksService } from './study_tasks.service';

describe('StudyTasksService', () => {
  let service: StudyTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyTasksService],
    }).compile();

    service = module.get<StudyTasksService>(StudyTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
