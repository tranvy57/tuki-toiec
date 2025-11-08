import { create } from 'zustand';
import { TestSection, SkillType, TestItem } from '~/types/skillTypes';
import { skillSectionsData } from '~/constants/skillSectionsData';

interface SkillStore {
  // State
  sections: Record<SkillType, TestSection[]>;
  selectedSkill: SkillType | null;
  currentTest: TestItem | null;

  // Actions
  toggleSectionExpansion: (skillType: SkillType, sectionId: string) => void;
  updateTestProgress: (
    skillType: SkillType,
    sectionId: string,
    testId: number,
    progress: number
  ) => void;
  markTestCompleted: (skillType: SkillType, sectionId: string, testId: number) => void;
  setSelectedSkill: (skill: SkillType) => void;
  setCurrentTest: (test: TestItem | null) => void;
  resetSkillProgress: (skillType: SkillType) => void;
  getSectionById: (skillType: SkillType, sectionId: string) => TestSection | undefined;
  getTestById: (skillType: SkillType, sectionId: string, testId: number) => TestItem | undefined;
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  // Initial state
  sections: skillSectionsData,
  selectedSkill: null,
  currentTest: null,

  // Toggle section expansion
  toggleSectionExpansion: (skillType, sectionId) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [skillType]: state.sections[skillType].map((section) =>
          section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
        ),
      },
    }));
  },

  // Update test progress
  updateTestProgress: (skillType, sectionId, testId, progress) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [skillType]: state.sections[skillType].map((section) =>
          section.id === sectionId
            ? {
                ...section,
                tests: section.tests.map((test) =>
                  test.test_id === testId ? { ...test, progress, isNew: false } : test
                ),
              }
            : section
        ),
      },
    }));
  },

  // Mark test as completed
  markTestCompleted: (skillType, sectionId, testId) => {
    set((state) => {
      const updatedSections = {
        ...state.sections,
        [skillType]: state.sections[skillType].map((section) => {
          if (section.id === sectionId) {
            const updatedTests = section.tests.map((test) =>
              test.test_id === testId
                ? { ...test, completed: true, progress: 100, isNew: false }
                : test
            );
            const completedCount = updatedTests.filter((test) => test.completed).length;

            return {
              ...section,
              tests: updatedTests,
              completedTests: completedCount,
            };
          }
          return section;
        }),
      };

      return { sections: updatedSections };
    });
  },

  // Set selected skill
  setSelectedSkill: (skill) => {
    set({ selectedSkill: skill });
  },

  // Set current test
  setCurrentTest: (test) => {
    set({ currentTest: test });
  },

  // Reset skill progress
  resetSkillProgress: (skillType) => {
    set((state) => ({
      sections: {
        ...state.sections,
        [skillType]: skillSectionsData[skillType].map((section) => ({
          ...section,
          completedTests: 0,
          tests: section.tests.map((test) => ({
            ...test,
            completed: false,
            progress: 0,
            isNew: true,
          })),
        })),
      },
    }));
  },

  // Get section by ID
  getSectionById: (skillType, sectionId) => {
    return get().sections[skillType].find((section) => section.id === sectionId);
  },

  // Get test by ID
  getTestById: (skillType, sectionId, testId) => {
    const section = get().getSectionById(skillType, sectionId);
    return section?.tests.find((test) => test.test_id === testId);
  },
}));
