export interface Phase {
  phase_id: string;
  plan_id: string;
  title: string;
  order_no: number;
  lessons: number[];
  status: 'active' | 'locked';
}

export interface LessonNode {
  id: string;
  title: string;
  subtitle?: string;
  skills: string[];
  status: 'completed' | 'active' | 'locked';
  type: 'lesson' | 'quiz' | 'test';
}
