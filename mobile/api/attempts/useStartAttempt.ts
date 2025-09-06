import { useMutation } from '@tanstack/react-query';
import { api } from '~/libs/axios';

// Câu hỏi trong 1 group
export interface Question {
  id: string;
  numberLabel: number; // số câu
  content: string; // nội dung câu hỏi
}

// Một group trong Part
export interface Group {
  id: string;
  orderIndex: number;
  paragraphEn: string | null;
  paragraphVn: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  questions: Question[];
}

// Một Part trong Test
export interface Part {
  id: string;
  partNumber: number; // từ 1-7
  directions: string;
  groups: Group[];
}

// Thông tin Test
export interface Test {
  id: string;
  title: string;
  audioUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parts: Part[];
}

// Payload data trả về khi start test
export interface PracticeTestResponse {
  mode: 'practice' | 'test';
  test: Test;
  startedAt: string;
  finishAt: string | null;
  totalScore: number | null;
  score: number | null;
  status: 'in_progress' | 'submitted';
}

async function startTestPractice(testId: string): Promise<PracticeTestResponse> {
  const res = await api.post(`/attempts`, {
    testId,
    mode: 'practice',
  });
  return res.data.data; // chính là object { mode, test, startedAt, ... }
}

export function useStartTestPractice() {
  return useMutation({
    mutationFn: (testId: string) => startTestPractice(testId),
  });
}
