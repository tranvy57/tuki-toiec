export class CreateAttemptDto {
  mode: 'practice' | 'test' | 'review';
  partIds: string[];
  testId?: string;
}
