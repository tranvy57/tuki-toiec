import { Test, TestingModule } from '@nestjs/testing';
import { LessonItemService } from './lesson_item.service';

describe('LessonItemService', () => {
  let service: LessonItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonItemService],
    }).compile();

    service = module.get<LessonItemService>(LessonItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
