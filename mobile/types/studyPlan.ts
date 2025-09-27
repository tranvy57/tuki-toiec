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

// New interfaces for StudyPlan modal
export interface StudyPlanProgress {
  completed_tasks: number;
  total_tasks: number;
}

export interface StudyPlanPhase {
  phase_id: number;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
}

export interface StudyPlan {
  plan_id: number;
  user_id: number;
  target_score: number;
  start_date: string;
  total_days: number;
  progress: StudyPlanProgress;
  phases: StudyPlanPhase[];
}

// New interfaces for Daily Study Tasks
export interface DailySummary {
  completed: number;
  total: number;
  progress: number;
}

export interface Lesson {
  lesson_id: number;
  name: string;
  description: string;
  unit: string;
}

export interface StudyTask {
  task_id: number;
  mode: 'learn' | 'review';
  status: 'completed' | 'in_progress' | 'pending';
  lesson: Lesson;
  content_url: string;
}

export interface DailyStudy {
  date: string;
  plan_id: number;
  user_id: number;
  summary: DailySummary;
  tasks: StudyTask[];
}