import { Test, TestingModule } from '@nestjs/testing';
import { UserCoursesService } from './user_courses.service';

describe('UserCoursesService', () => {
  let service: UserCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCoursesService],
    }).compile();

    service = module.get<UserCoursesService>(UserCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
