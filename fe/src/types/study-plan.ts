export interface Phase {
  phase_id: string;
  plan_id: string;
  title: string;
  order_no: number;
  lessons: number[];
  status: 'active' | 'locked' | 'completed';
}

export interface LessonNode {
  id: string;
  title: string;
  subtitle?: string;
  skills: string[];
  status: 'completed' | 'active' | 'locked';
  type: 'lesson' | 'quiz' | 'test';
}

export interface StudyPlan {
  id: string;
  title: string;
  phases: Phase[];
  currentPhase?: string;
  progress: number;
}

export interface PhaseNodeProps {
  phase: Phase;
  index: number;
  isLeft: boolean;
  onPhasePress: (phaseId: string) => void;
  onPhaseStart: (phaseId: string) => void;
}
