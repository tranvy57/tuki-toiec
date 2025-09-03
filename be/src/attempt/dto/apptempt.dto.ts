import { TestDto } from 'src/test/dto/test.dto';

export class AttemptDto {
  mode: 'practice' | 'test';
  partIds: string[];
  testId?: string;
  test: TestDto;
}
