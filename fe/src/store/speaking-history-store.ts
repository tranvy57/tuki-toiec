import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for speaking history
export interface SpeakingAttempt {
  id: string;
  skill: string;
  topicId?: string;
  attemptDate: Date;
  score: number;
  duration: number; // in seconds
  status: "completed" | "in-progress" | "failed";
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
  getAttemptsByTopic: (skill: string, topicId: string) => SpeakingAttempt[];
  getRecentAttempts: (limit?: number) => SpeakingAttempt[];
  clearHistory: () => void;
}

export type SpeakingHistoryStore = SpeakingHistoryState &
  SpeakingHistoryActions;

export const useSpeakingHistory = create<SpeakingHistoryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      attempts: [],
      isHistoryDialogVisible: false,
      selectedAttempt: null,
      isDetailDialogVisible: false,

      // Dialog actions
      showHistoryDialog: () => set({ isHistoryDialogVisible: true }),
      hideHistoryDialog: () =>
        set({ isHistoryDialogVisible: false, selectedAttempt: null }),
      showDetailDialog: (attempt) =>
        set({ selectedAttempt: attempt, isDetailDialogVisible: true }),
      hideDetailDialog: () =>
        set({ isDetailDialogVisible: false, selectedAttempt: null }),

      // Attempt management
      addAttempt: (attempt) =>
        set((state) => ({
          attempts: [attempt, ...state.attempts].sort(
            (a, b) =>
              new Date(b.attemptDate).getTime() -
              new Date(a.attemptDate).getTime()
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

      getAttemptsByTopic: (skill, topicId) => {
        const state = get();
        return state.attempts.filter(
          (attempt) => attempt.skill === skill && attempt.topicId === topicId
        );
      },

      getRecentAttempts: (limit = 10) => {
        const state = get();
        return state.attempts.slice(0, limit);
      },

      clearHistory: () => set({ attempts: [] }),
    }),
    {
      name: "speaking-history-storage",
      // Handle Date serialization/deserialization
      partialize: (state) => ({
        attempts: state.attempts.map((attempt) => ({
          ...attempt,
          attemptDate: attempt.attemptDate.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO strings back to Date objects
          state.attempts = state.attempts.map((attempt) => ({
            ...attempt,
            attemptDate: new Date(attempt.attemptDate),
          }));
        }
      },
    }
  )
);

// Helper function to create a new attempt
export const createSpeakingAttempt = (
  skill: string,
  taskType: string,
  question: string,
  score: number = 0,
  duration: number = 0,
  topicId?: string
): SpeakingAttempt => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  skill,
  topicId,
  attemptDate: new Date(),
  score,
  duration,
  status: "completed",
  details: {
    taskType,
    question,
  },
});
