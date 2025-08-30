import { Test, TestingModule } from '@nestjs/testing';
import { PhaseLessonsService } from './phase_lessons.service';

describe('PhaseLessonsService', () => {
  let service: PhaseLessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhaseLessonsService],
    }).compile();

    service = module.get<PhaseLessonsService>(PhaseLessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
