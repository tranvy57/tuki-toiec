import { create } from 'zustand';
import { PlanContent, PlanLesson, StudyPlan } from '~/api/plans/usePlan';
import { StudyTask } from '~/types/studyPlan';

interface CurrentTaskState {
  // Current task and content data
  currentTask: StudyTask | null;
  currentLesson: PlanLesson | null;
  currentContent: PlanContent | null;
  currentStudyPlan: StudyPlan | null;

  // Items within the content (if any)
  currentItems: any[] | null;
  currentItemIndex: number;

  // Navigation state
  isLearning: boolean;
  mode: 'learn' | 'review' | 'practice';

  // Actions
  setCurrentTask: (
    task: StudyTask,
    lesson: PlanLesson,
    studyPlan: StudyPlan,
    mode?: 'learn' | 'review' | 'practice'
  ) => void;

  setCurrentContent: (content: PlanContent, items?: any[]) => void;

  setCurrentItemIndex: (index: number) => void;
  goToNextItem: () => void;
  goToPreviousItem: () => void;

  startLearning: () => void;
  completeLearning: () => void;
  resetTask: () => void;

  // Getters
  getCurrentItem: () => any | null;
  getTotalItems: () => number;
  getIsLastItem: () => boolean;
  getIsFirstItem: () => boolean;
  getProgress: () => number;
}

export const useCurrentTaskStore = create<CurrentTaskState>((set, get) => ({
  // Initial state
  currentTask: null,
  currentLesson: null,
  currentContent: null,
  currentStudyPlan: null,
  currentItems: null,
  currentItemIndex: 0,
  isLearning: false,
  mode: 'learn',

  // Actions
  setCurrentTask: (task, lesson, studyPlan, mode = 'learn') => {
    set({
      currentTask: task,
      currentLesson: lesson,
      currentStudyPlan: studyPlan,
      currentContent: null, // Reset content when setting new task
      currentItems: null,
      currentItemIndex: 0,
      isLearning: false,
      mode,
    });
  },

  setCurrentContent: (content, items = undefined) => {
    set({
      currentContent: content,
      currentItems: items || null,
      currentItemIndex: 0,
    });
  },

  setCurrentItemIndex: (index) => {
    const { currentItems } = get();
    if (currentItems && index >= 0 && index < currentItems.length) {
      set({ currentItemIndex: index });
    }
  },

  goToNextItem: () => {
    const { currentItemIndex, currentItems } = get();
    if (currentItems && currentItemIndex < currentItems.length - 1) {
      set({ currentItemIndex: currentItemIndex + 1 });
    }
  },

  goToPreviousItem: () => {
    const { currentItemIndex } = get();
    if (currentItemIndex > 0) {
      set({ currentItemIndex: currentItemIndex - 1 });
    }
  },

  startLearning: () => {
    set({ isLearning: true });
  },

  completeLearning: () => {
    set({ isLearning: false });
    // Here you could also call an API to mark the task as completed
  },

  resetTask: () => {
    set({
      currentTask: null,
      currentLesson: null,
      currentContent: null,
      currentStudyPlan: null,
      currentItems: null,
      currentItemIndex: 0,
      isLearning: false,
      mode: 'learn',
    });
  },

  // Getters
  getCurrentItem: () => {
    const { currentItems, currentItemIndex } = get();
    return currentItems ? currentItems[currentItemIndex] || null : null;
  },

  getTotalItems: () => {
    const { currentItems } = get();
    return currentItems ? currentItems.length : 0;
  },

  getIsLastItem: () => {
    const { currentItemIndex, currentItems } = get();
    return currentItems ? currentItemIndex >= currentItems.length - 1 : true;
  },

  getIsFirstItem: () => {
    const { currentItemIndex } = get();
    return currentItemIndex <= 0;
  },

  getProgress: () => {
    const { currentItemIndex, currentItems } = get();
    if (!currentItems || currentItems.length === 0) return 0;
    return Math.round(((currentItemIndex + 1) / currentItems.length) * 100);
  },
}));

// Custom hook for easier usage
export const useCurrentTask = () => {
  const store = useCurrentTaskStore();

  return {
    // State
    currentTask: store.currentTask,
    currentLesson: store.currentLesson,
    currentContent: store.currentContent,
    currentStudyPlan: store.currentStudyPlan,
    currentItems: store.currentItems,
    currentItemIndex: store.currentItemIndex,
    isLearning: store.isLearning,
    mode: store.mode,

    // Current item data
    currentItem: store.getCurrentItem(),
    totalItems: store.getTotalItems(),
    isLastItem: store.getIsLastItem(),
    isFirstItem: store.getIsFirstItem(),
    progress: store.getProgress(),

    // Actions
    setCurrentTask: store.setCurrentTask,
    setCurrentContent: store.setCurrentContent,
    setCurrentItemIndex: store.setCurrentItemIndex,
    goToNextItem: store.goToNextItem,
    goToPreviousItem: store.goToPreviousItem,
    startLearning: store.startLearning,
    completeLearning: store.completeLearning,
    resetTask: store.resetTask,
  };
};

// Helper function to start a task with content
export const startTaskWithContent = (
  task: StudyTask,
  lesson: PlanLesson,
  studyPlan: StudyPlan,
  content: PlanContent,
  items?: any[],
  mode: 'learn' | 'review' | 'practice' = 'learn'
) => {
  const { setCurrentTask, setCurrentContent } = useCurrentTaskStore.getState();

  // Set the task first
  setCurrentTask(task, lesson, studyPlan, mode);

  // Then set the specific content
  setCurrentContent(content, items);
};
