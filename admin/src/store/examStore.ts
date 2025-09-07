import { create } from 'zustand';
import type { Exam } from '@/types';

interface ExamStore {
  exams: Exam[];
  selectedExam: Exam | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setExams: (exams: Exam[]) => void;
  addExam: (exam: Exam) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  setSelectedExam: (exam: Exam | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  exams: [],
  selectedExam: null,
  isLoading: false,
  error: null,

  setExams: (exams) => set({ exams }),
  
  addExam: (exam) => {
    const { exams } = get();
    set({ exams: [...exams, exam] });
  },
  
  updateExam: (id, examData) => {
    const { exams } = get();
    set({
      exams: exams.map((exam: any) => 
        exam.id === id ? { ...exam, ...examData } : exam
      ),
    });
  },
  
  deleteExam: (id) => {
    const { exams } = get();
    set({
      exams: exams.filter((exam: any) => exam.id !== id),
    });
  },
  
  setSelectedExam: (exam) => set({ selectedExam: exam }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
