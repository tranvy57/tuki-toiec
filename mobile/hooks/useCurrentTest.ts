// stores/usePracticeTestStore.ts
import { create } from 'zustand';
import { Group, Part, Question, Test } from '~/api/attempts/useStartAttempt';

interface PracticeTestState {
  test: Test | null;
  currentPart: Part | null;
  currentGroup: Group | null;
  currentGroupQuestion: Question[] | null;

  // actions
  setTest: (test: Test) => void;
  setCurrentPart: (partNumber: number) => void;
  setCurrentGroup: (groupId: string) => void;
  nextPart: () => void;
  nextGroup: () => void;
  beforeGroup: () => void;
  reset: () => void;
}

export const useCurrentTest = create<PracticeTestState>((set, get) => ({
  test: null,
  currentPart: null,
  currentGroup: null,
  currentGroupQuestion: null,

  setTest: (test) =>
    set({
      test,
      currentPart: test.parts[0] || null,
      currentGroup: test.parts[0]?.groups[0] || null,
      currentGroupQuestion: test.parts[0]?.groups[0]?.questions || null,
    }),

  setCurrentPart: (partNumber) => {
    const test = get().test;
    if (!test) return;
    const part = test.parts.find((p) => p.partNumber === partNumber) || null;
    set({ currentPart: part, currentGroup: null });
  },

  nextPart: () => {
    const part = get().currentPart;
    const test = get().test;
    if (!part) return;

    const nextPart = test?.parts.find((p) => p.partNumber === part.partNumber + 1) || null;
    set({ currentPart: nextPart, currentGroup: null });
  },

  nextGroup: () => {
    const part = get().currentPart;
    const group = get().currentGroup;
    const test = get().test;
    if (!part || !group || !test) return;

    // tìm group kế tiếp trong part hiện tại
    const nextGroup = part.groups.find((g) => g.orderIndex === group.orderIndex + 1) || null;

    if (nextGroup) {
      // vẫn còn group trong part này
      set({
        currentGroup: nextGroup,
        currentGroupQuestion: nextGroup.questions,
      });
    } else {
      // hết group trong part → chuyển sang part kế tiếp
      const nextPart = test.parts.find((p) => p.partNumber === part.partNumber + 1) || null;
      if (nextPart) {
        const firstGroup = nextPart.groups[0] ?? null;
        set({
          currentPart: nextPart,
          currentGroup: firstGroup,
          currentGroupQuestion: firstGroup?.questions ?? null,
        });
      }
    }
  },

  setCurrentGroup: (groupId) => {
    const part = get().currentPart;
    if (!part) return;
    const group = part.groups.find((g) => g.id === groupId) || null;
    set({ currentGroup: group, currentGroupQuestion: group?.questions });
  },

  beforeGroup: () => {
    const part = get().currentPart;
    const group = get().currentGroup;
    const test = get().test;
    if (!part || !group || !test) return;

    // tìm group trước trong cùng part
    const beforeGroup = part.groups.find((g) => g.orderIndex === group.orderIndex - 1) || null;

    if (beforeGroup) {
      // vẫn còn group trước trong part này
      set({
        currentGroup: beforeGroup,
        currentGroupQuestion: beforeGroup.questions,
      });
    } else {
      // đang ở group đầu tiên -> chuyển sang part trước
      const prevPart = test.parts.find((p) => p.partNumber === part.partNumber - 1) || null;

      if (prevPart) {
        // lấy group cuối cùng trong part trước
        const lastGroup = prevPart.groups[prevPart.groups.length - 1] ?? null;

        set({
          currentPart: prevPart,
          currentGroup: lastGroup,
          currentGroupQuestion: lastGroup?.questions ?? null,
        });
      }
    }
  },

  reset: () => set({ test: null, currentPart: null, currentGroup: null }),
}));
