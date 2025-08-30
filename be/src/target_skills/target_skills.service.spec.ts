import { Test, TestingModule } from '@nestjs/testing';
import { TargetSkillsService } from './target_skills.service';

describe('TargetSkillsService', () => {
  let service: TargetSkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TargetSkillsService],
    }).compile();

    service = module.get<TargetSkillsService>(TargetSkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
