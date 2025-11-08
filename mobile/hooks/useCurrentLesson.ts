import { create } from 'zustand';
import { LessonByModality } from '~/api/lesson/useLesson';

interface CurrentLessonState {
  currentLesson: LessonByModality | null;
  currentLessonId: string | null;
  currentModality: string | null;
  currentItemIndex: number;

  // Actions
  setCurrentLesson: (lesson: LessonByModality, modality: string) => void;
  setCurrentItemIndex: (index: number) => void;
  goToNextItem: () => void;
  goToPreviousItem: () => void;
  resetLesson: () => void;

  // Getters
  getCurrentItem: () => any;
  getTotalItems: () => number;
  getIsLastItem: () => boolean;
  getIsFirstItem: () => boolean;
}

export const useCurrentLessonStore = create<CurrentLessonState>((set, get) => ({
  currentLesson: null,
  currentLessonId: null,
  currentModality: null,
  currentItemIndex: 0,

  setCurrentLesson: (lesson, modality) => {
    set({
      currentLesson: lesson,
      currentLessonId: lesson.lessonId,
      currentModality: modality,
      currentItemIndex: 0,
    });
  },

  setCurrentItemIndex: (index) => {
    const { currentLesson } = get();
    if (currentLesson && index >= 0 && index < currentLesson.items.length) {
      set({ currentItemIndex: index });
    }
  },

  goToNextItem: () => {
    const { currentItemIndex, currentLesson } = get();
    if (currentLesson && currentItemIndex < currentLesson.items.length - 1) {
      set({ currentItemIndex: currentItemIndex + 1 });
    }
  },

  goToPreviousItem: () => {
    const { currentItemIndex } = get();
    if (currentItemIndex > 0) {
      set({ currentItemIndex: currentItemIndex - 1 });
    }
  },

  resetLesson: () => {
    set({
      currentLesson: null,
      currentLessonId: null,
      currentModality: null,
      currentItemIndex: 0,
    });
  },

  getCurrentItem: () => {
    const { currentLesson, currentItemIndex } = get();
    return currentLesson?.items[currentItemIndex] || null;
  },

  getTotalItems: () => {
    const { currentLesson } = get();
    return currentLesson?.items.length || 0;
  },

  getIsLastItem: () => {
    const { currentItemIndex, currentLesson } = get();
    return currentLesson ? currentItemIndex >= currentLesson.items.length - 1 : true;
  },

  getIsFirstItem: () => {
    const { currentItemIndex } = get();
    return currentItemIndex <= 0;
  },
}));

// Custom hook for easier usage
export const useCurrentLesson = () => {
  const store = useCurrentLessonStore();

  return {
    // State
    currentLesson: store.currentLesson,
    currentLessonId: store.currentLessonId,
    currentModality: store.currentModality,
    currentItemIndex: store.currentItemIndex,
    currentItem: store.getCurrentItem(),

    // Metadata
    totalItems: store.getTotalItems(),
    isLastItem: store.getIsLastItem(),
    isFirstItem: store.getIsFirstItem(),

    // Actions
    setCurrentLesson: store.setCurrentLesson,
    setCurrentItemIndex: store.setCurrentItemIndex,
    goToNextItem: store.goToNextItem,
    goToPreviousItem: store.goToPreviousItem,
    resetLesson: store.resetLesson,
  };
};
