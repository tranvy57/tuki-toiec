import { Test, TestingModule } from '@nestjs/testing';
import { LessonSkillsService } from './lesson_skills.service';

describe('LessonSkillsService', () => {
  let service: LessonSkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonSkillsService],
    }).compile();

    service = module.get<LessonSkillsService>(LessonSkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
