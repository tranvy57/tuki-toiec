
export class LessonItemDto {
  id: string;

  modality: string;

  title?: string;

  bandHint?: string;

  difficulty?: 'easy' | 'medium' | 'hard';

  promptJsonb: Record<string, any>;

  solutionJsonb: Record<string, any>;
}

export class LessonWithItemsDto {
  lessonId: string;

  name: string;

  items: LessonItemDto[];
}
