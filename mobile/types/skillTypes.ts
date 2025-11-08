export interface TestItem {
  test_id: number;
  title: string;
  completed?: boolean;
  progress?: number;
  isNew?: boolean;
}

export interface TestSection {
  id: string;
  title: string;
  description: string;
  totalTests: number;
  completedTests: number;
  modality?: string;
  tests: TestItem[];
  isExpanded?: boolean;
}

export interface SkillData {
  listening: TestSection[];
  reading: TestSection[];
  speaking: TestSection[];
  writing: TestSection[];
}

export type SkillType = keyof SkillData;
