import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Group,
  Part,
  PracticeTestResponse,
  Question,
  ResultTestResponse,
  Test,
} from "@/types";

interface PracticeTestState {
  // Core state
  fullTest: PracticeTestResponse | null;
  resultTest: ResultTestResponse | null;
  test: Test | null;
  attemptId: string | null;
  currentPart: Part | null;
  currentGroup: Group | null;
  currentGroupQuestion: Question[] | null;
  selectedAnswers: Record<string, string>;

  // Performance optimizations - cache frequently accessed data
  partCache: Map<number, Part>;
  groupCache: Map<string, Group>;

  // Actions
  setTest: (test: Test) => void;
  setFullTest: (fullTest: PracticeTestResponse) => void;
  setResultTest: (resultTest: ResultTestResponse) => void;
  setAttemptId: (attemptId: string | null) => void;
  setCurrentPart: (partNumber: number) => void;
  setCurrentGroup: (groupId: string) => void;
  setAnswer: (questionId: string, answerKey: string) => void;
  findGroupByQuestionId: (questionId: string) => Group | null;

  // Navigation
  nextPart: () => void;
  nextGroup: () => void;
  previousGroup: () => void;

  // Utilities
  reset: () => void;
  clearPersistedState: () => void;
  getAnswerCount: () => number;
  getPartProgress: (partNumber: number) => number;
}

const STORAGE_KEY = "practice-test-storage";

export const usePracticeTest = create<PracticeTestState>()(
  persist(
    (set, get) => ({
      // Initial state
      fullTest: null,
      resultTest: null,
      test: null,
      attemptId: null,
      currentPart: null,
      currentGroup: null,
      currentGroupQuestion: null,
      selectedAnswers: {},
      partCache: new Map(),
      groupCache: new Map(),

      // Actions
      setAnswer: (questionId, answerKey) =>
        set((state) => ({
          selectedAnswers: {
            ...state.selectedAnswers,
            [questionId]: answerKey,
          },
        })),

      setFullTest: (fullTest) => {
        const partCache = new Map<number, Part>();
        const groupCache = new Map<string, Group>();

        const sortedParts = [...fullTest.parts].sort(
          (a, b) => a.partNumber - b.partNumber
        );

        sortedParts.forEach((part) => {
          partCache.set(part.partNumber, part);

          part.groups.forEach((group) => {
            groupCache.set(group.id, group);
          });
        });

        const firstPart = sortedParts[0];
        const firstGroup = firstPart?.groups[0];

        set({
          fullTest: { ...fullTest, parts: sortedParts },
          partCache,
          groupCache,
          currentPart: firstPart || null,
          currentGroup: firstGroup || null,
          currentGroupQuestion: firstGroup?.questions || null,
        });
      },

      setTest: (test) => set({ test }),

      setResultTest: (resultTest) => set({ resultTest }),

      setAttemptId: (attemptId) => set({ attemptId }),

      setCurrentPart: (partNumber) => {
        const { partCache } = get();
        const part = partCache.get(partNumber);
        if (part) {
          const firstGroup = part.groups[0];
          set({
            currentPart: part,
            currentGroup: firstGroup || null,
            currentGroupQuestion: firstGroup?.questions || null,
          });
        }
      },

      setCurrentGroup: (groupId) => {
        const { groupCache } = get();
        const group = groupCache.get(groupId);
        if (group) {
          set({
            currentGroup: group,
            currentGroupQuestion: group.questions,
          });
        }
      },

      findGroupByQuestionId: (questionId) => {
        const { groupCache } = get();
        for (let group of groupCache.values()) {
          if (group.questions.some((q) => q.id === questionId)) {
            return group;
          }
        }
        return null;
      },

      nextPart: () => {
        const { currentPart, partCache } = get();
        if (!currentPart) return;

        const nextPart = partCache.get(currentPart.partNumber + 1);
        if (nextPart) {
          const firstGroup = nextPart.groups[0];
          set({
            currentPart: nextPart,
            currentGroup: firstGroup || null,
            currentGroupQuestion: firstGroup?.questions || null,
          });
        }
      },

      nextGroup: () => {
        const { currentPart, currentGroup, partCache } = get();
        if (!currentPart || !currentGroup) return;

        const currentGroupIndex = currentPart.groups.findIndex(
          (g) => g.id === currentGroup.id
        );
        const nextGroup = currentPart.groups[currentGroupIndex + 1];

        if (nextGroup) {
          set({
            currentGroup: nextGroup,
            currentGroupQuestion: nextGroup.questions,
          });
        } else {
          // Move to next part
          const nextPart = partCache.get(currentPart.partNumber + 1);
          if (nextPart && nextPart.groups.length > 0) {
            const firstGroup = nextPart.groups[0];
            set({
              currentPart: nextPart,
              currentGroup: firstGroup,
              currentGroupQuestion: firstGroup.questions,
            });
          }
        }
      },

      previousGroup: () => {
        const { currentPart, currentGroup, partCache } = get();
        if (!currentPart || !currentGroup) return;

        const currentGroupIndex = currentPart.groups.findIndex(
          (g) => g.id === currentGroup.id
        );
        const prevGroup = currentPart.groups[currentGroupIndex - 1];

        if (prevGroup) {
          set({
            currentGroup: prevGroup,
            currentGroupQuestion: prevGroup.questions,
          });
        } else {
          const prevPart = partCache.get(currentPart.partNumber - 1);
          if (prevPart && prevPart.groups.length > 0) {
            const lastGroup = prevPart.groups[prevPart.groups.length - 1];
            set({
              currentPart: prevPart,
              currentGroup: lastGroup,
              currentGroupQuestion: lastGroup.questions,
            });
          }
        }
      },

      getAnswerCount: () => {
        return Object.keys(get().selectedAnswers).length;
      },

      getPartProgress: (partNumber) => {
        const { partCache, selectedAnswers } = get();
        const part = partCache.get(partNumber);
        if (!part) return 0;

        const totalQuestions = part.groups.reduce(
          (sum, group) => sum + group.questions.length,
          0
        );
        const answeredQuestions = part.groups.reduce((sum, group) => {
          return (
            sum + group.questions.filter((q) => selectedAnswers[q.id]).length
          );
        }, 0);

        return totalQuestions > 0
          ? (answeredQuestions / totalQuestions) * 100
          : 0;
      },

      reset: () =>
        set({
          fullTest: null,
          resultTest: null,
          test: null,
          attemptId: null,
          currentPart: null,
          currentGroup: null,
          currentGroupQuestion: null,
          selectedAnswers: {},
          partCache: new Map(),
          groupCache: new Map(),
        }),

      clearPersistedState: () => {
        localStorage.removeItem(STORAGE_KEY);
        get().reset();
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        selectedAnswers: state.selectedAnswers,
        fullTest: state.fullTest,
        attemptId: state.attemptId,
      }),
    }
  )
);
