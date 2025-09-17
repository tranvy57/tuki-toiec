// stores/usePracticeTestStore.ts
import { create } from 'zustand';
import { Group, Part, PracticeTestResponse, Question, ResultTestResponse, Test } from '~/types/response/TestResponse';

interface PracticeTestState {
  fullTest: PracticeTestResponse | null;
  resultTest: ResultTestResponse | null;
  test: Test | null;
  currentPart: Part | null;
  currentGroup: Group | null;
  currentGroupQuestion: Question[] | null;
  selectedAnswers: Record<string, string>;
  
  // Cache for better performance
  partCache: Map<number, Part>;
  groupCache: Map<string, Group>;

  // actions
  setTest: (test: Test) => void;
  setFullTest: (fullTest: PracticeTestResponse) => void;
  setResultTest: (resultTest: ResultTestResponse) => void;  
  setCurrentPart: (partNumber: number) => void;
  setCurrentGroup: (groupId: string) => void;
  nextPart: () => void;
  nextGroup: () => void;
  beforeGroup: () => void;
  setAnswer: (questionId: string, answerKey: string) => void;
  reset: () => void;
}

export const useCurrentTest = create<PracticeTestState>((set, get) => ({
  fullTest: null,
  resultTest: null,
  test: null,
  currentPart: null,
  currentGroup: null,
  currentGroupQuestion: null,
  selectedAnswers: {},
  partCache: new Map(),
  groupCache: new Map(),
  
  setAnswer: (questionId, answerKey) =>
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: answerKey,
      },
    })),
    
  setFullTest: (fullTest) => {
    // Build cache when setting full test
    const partCache = new Map<number, Part>();
    const groupCache = new Map<string, Group>();
    
    fullTest.parts.forEach(part => {
      partCache.set(part.partNumber, part);
      part.groups.forEach(group => {
        groupCache.set(group.id, group);
      });
    });

    set({
      fullTest,
      partCache,
      groupCache,
      currentPart: fullTest.parts[0] || null,
      currentGroup: fullTest.parts[0]?.groups[0] || null,
      currentGroupQuestion: fullTest.parts[0]?.groups[0]?.questions || null,
    });
  },
  setTest: (test) =>
    set({
      test,
    }),
  setResultTest: (resultTest) =>
    set({
      resultTest,
    }),
  setCurrentPart: (partNumber) => {
    const { partCache } = get();
    const part = partCache.get(partNumber) || null;
    set({ currentPart: part, currentGroup: part?.groups[0] || null });
  },

  nextPart: () => {
    const { currentPart, partCache } = get();
    if (!currentPart) return;

    const nextPart = partCache.get(currentPart.partNumber + 1) || null;
    set({ 
      currentPart: nextPart, 
      currentGroup: nextPart?.groups[0] || null,
      currentGroupQuestion: nextPart?.groups[0]?.questions || null,
    });
  },

  nextGroup: () => {
    const { currentPart, currentGroup, partCache } = get();
    if (!currentPart || !currentGroup) return;

    // Find next group in current part (using cached array index)
    const currentGroupIndex = currentPart.groups.findIndex(g => g.id === currentGroup.id);
    const nextGroup = currentPart.groups[currentGroupIndex + 1];

    if (nextGroup) {
      // Still have groups in current part
      set({
        currentGroup: nextGroup,
        currentGroupQuestion: nextGroup.questions,
      });
    } else {
      // Move to next part
      const nextPart = partCache.get(currentPart.partNumber + 1);
      if (nextPart) {
        const firstGroup = nextPart.groups[0];
        set({
          currentPart: nextPart,
          currentGroup: firstGroup || null,
          currentGroupQuestion: firstGroup?.questions || null,
        });
      }
    }
  },

  setCurrentGroup: (groupId) => {
    const { groupCache } = get();
    const group = groupCache.get(groupId) || null;
    set({ currentGroup: group, currentGroupQuestion: group?.questions || null });
  },

  beforeGroup: () => {
    const { currentPart, currentGroup, partCache } = get();
    if (!currentPart || !currentGroup) return;

    // Find previous group in current part (using cached array index)
    const currentGroupIndex = currentPart.groups.findIndex(g => g.id === currentGroup.id);
    const prevGroup = currentPart.groups[currentGroupIndex - 1];

    if (prevGroup) {
      // Still have previous groups in current part
      set({
        currentGroup: prevGroup,
        currentGroupQuestion: prevGroup.questions,
      });
    } else {
      // Move to previous part's last group
      const prevPart = partCache.get(currentPart.partNumber - 1);
      if (prevPart) {
        const lastGroup = prevPart.groups[prevPart.groups.length - 1];
        set({
          currentPart: prevPart,
          currentGroup: lastGroup || null,
          currentGroupQuestion: lastGroup?.questions || null,
        });
      }
    }
  },

  reset: () =>
    set({
      fullTest: null,
      test: null,
      currentPart: null,
      currentGroup: null,
      currentGroupQuestion: null,
      selectedAnswers: {},
      partCache: new Map(),
      groupCache: new Map(),
    }),
}));
