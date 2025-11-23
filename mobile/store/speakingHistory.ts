import { create } from 'zustand';

// Types for speaking history
interface SpeakingAttempt {
  id: string;
  skill: string;
  attemptDate: Date;
  score: number;
  duration: number; // in seconds
  status: 'completed' | 'in-progress' | 'failed';
  details: {
    taskType: string;
    question: string;
    audioUrl?: string;
    feedback?: string;
    transcription?: string;
  };
}

interface SpeakingHistoryState {
  attempts: SpeakingAttempt[];
  isHistoryDialogVisible: boolean;
  selectedAttempt: SpeakingAttempt | null;
  isDetailDialogVisible: boolean;
}

interface SpeakingHistoryActions {
  // Dialog actions
  showHistoryDialog: () => void;
  hideHistoryDialog: () => void;
  showDetailDialog: (attempt: SpeakingAttempt) => void;
  hideDetailDialog: () => void;

  // Attempt management
  addAttempt: (attempt: SpeakingAttempt) => void;
  updateAttempt: (id: string, updates: Partial<SpeakingAttempt>) => void;
  getAttemptsBySkill: (skill: string) => SpeakingAttempt[];
  getRecentAttempts: (limit?: number) => SpeakingAttempt[];
  clearHistory: () => void;
}

export type SpeakingHistoryStore = SpeakingHistoryState & SpeakingHistoryActions;

export const useSpeakingHistory = create<SpeakingHistoryStore>((set, get) => ({
  // Initial state
  attempts: [],
  isHistoryDialogVisible: false,
  selectedAttempt: null,
  isDetailDialogVisible: false,

  // Dialog actions
  showHistoryDialog: () => set({ isHistoryDialogVisible: true }),
  hideHistoryDialog: () => set({ isHistoryDialogVisible: false, selectedAttempt: null }),
  showDetailDialog: (attempt) => set({ selectedAttempt: attempt, isDetailDialogVisible: true }),
  hideDetailDialog: () => set({ isDetailDialogVisible: false, selectedAttempt: null }),

  // Attempt management
  addAttempt: (attempt) =>
    set((state) => ({
      attempts: [attempt, ...state.attempts].sort(
        (a, b) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime()
      ),
    })),

  updateAttempt: (id, updates) =>
    set((state) => ({
      attempts: state.attempts.map((attempt) =>
        attempt.id === id ? { ...attempt, ...updates } : attempt
      ),
    })),

  getAttemptsBySkill: (skill) => {
    const state = get();
    return state.attempts.filter((attempt) => attempt.skill === skill);
  },

  getRecentAttempts: (limit = 10) => {
    const state = get();
    return state.attempts.slice(0, limit);
  },

  clearHistory: () => set({ attempts: [] }),
}));

// Helper function to create a new attempt
export const createSpeakingAttempt = (
  skill: string,
  taskType: string,
  question: string,
  score: number = 0,
  duration: number = 0
): SpeakingAttempt => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  skill,
  attemptDate: new Date(),
  score,
  duration,
  status: 'completed',
  details: {
    taskType,
    question,
  },
});
