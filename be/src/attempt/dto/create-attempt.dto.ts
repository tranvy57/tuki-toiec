export class CreateAttemptDto {
  mode: 'practice' | 'test';
  partIds: string[];
  testId?: string;
}
