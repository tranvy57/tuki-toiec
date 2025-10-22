import { Expose, Type } from 'class-transformer';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { QuestionDto } from 'src/question/dto/question.dto';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';
import { Unit } from 'src/unit/entities/unit.entity';

export class LessonDTO {
  @Expose()
  unit?: Unit | null;
  @Expose()
  name: string;
  @Expose()
  description?: string;
  @Expose()
  level?: string;
  @Expose()
  order: number;
  @Expose()
  id: string;

  @Expose()
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @Expose()
  @Type(() => StudyTask)
  studyTasks: StudyTask[];

}
