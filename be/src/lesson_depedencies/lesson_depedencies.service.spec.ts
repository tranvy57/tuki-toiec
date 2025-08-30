import { Test, TestingModule } from '@nestjs/testing';
import { LessonDepedenciesService } from './lesson_depedencies.service';

describe('LessonDepedenciesService', () => {
  let service: LessonDepedenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonDepedenciesService],
    }).compile();

    service = module.get<LessonDepedenciesService>(LessonDepedenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
