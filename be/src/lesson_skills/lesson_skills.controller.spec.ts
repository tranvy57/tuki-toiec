import { Test, TestingModule } from '@nestjs/testing';
import { LessonSkillsController } from './lesson_skills.controller';
import { LessonSkillsService } from './lesson_skills.service';

describe('LessonSkillsController', () => {
  let controller: LessonSkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonSkillsController],
      providers: [LessonSkillsService],
    }).compile();

    controller = module.get<LessonSkillsController>(LessonSkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
