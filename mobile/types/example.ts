// types.ts (tham khảo)
export type LessonStatus = 'locked' | 'next' | 'in_progress' | 'done' | 'mastered';
export type NodeType = 'lesson' | 'review' | 'checkpoint' | 'chest';
export type SkillTag =
  | 'listening'
  | 'reading'
  | 'grammar'
  | 'vocab'
  | 'part1'
  | 'part2'
  | 'part3'
  | 'part4'
  | 'part5'
  | 'part6'
  | 'part7';

export interface LessonNode {
  id: string;
  type: NodeType;
  unit: number; // chặng (Unit 1, Unit 2…)
  order: number; // để sắp xếp trong unit (không bắt buộc nếu bạn tự layout)
  title: string;
  subtitle?: string;
  skills: SkillTag[];
  xp: number; // điểm thưởng dự kiến
  estMinutes?: number; // thời lượng ước tính
  status: LessonStatus; // locked/next/in_progress/done/mastered
  prerequisites: string[]; // id bài cần hoàn thành trước
}

export interface PlanResponse {
  dailyGoal: { targetXP: number; todayXP: number; streak: number };
  nodes: LessonNode[];
}
