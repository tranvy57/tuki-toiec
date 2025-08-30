import { Test, TestingModule } from '@nestjs/testing';
import { TargetSkillsController } from './target_skills.controller';
import { TargetSkillsService } from './target_skills.service';

describe('TargetSkillsController', () => {
  let controller: TargetSkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TargetSkillsController],
      providers: [TargetSkillsService],
    }).compile();

    controller = module.get<TargetSkillsController>(TargetSkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
