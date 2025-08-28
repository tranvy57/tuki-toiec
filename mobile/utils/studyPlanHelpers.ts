import { colors } from '~/constants/Color';

export const getPhaseStatusColor = (status: 'active' | 'locked'): string => {
  switch (status) {
    case 'active':
      return 'blue';
    case 'locked':
      return colors.warmGray400; // Locked phase - gray
    default:
      return colors.warmGray400;
  }
};

export const getPhaseStatusIcon = (status: 'active' | 'locked'): string => {
  switch (status) {
    case 'active':
      return 'play-circle'; // Active phase
    case 'locked':
      return 'lock-closed'; // Locked phase
    default:
      return 'lock-closed';
  }
};

export const isPhaseAccessible = (status: 'active' | 'locked'): boolean => {
  return status === 'active';
};

export const getPhaseDescription = (lessonCount: number): string => {
  if (lessonCount === 1) {
    return '1 bài học';
  }
  return `${lessonCount} bài học`;
};

// Keep original lesson helpers for backward compatibility
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'active':
      return 'blue';
    case 'locked':
      return colors.warmGray400;
    default:
      return colors.warmGray400;
  }
};

export const getStatusIcon = (type: string, status: string): string => {
  if (status === 'completed') {
    return 'checkmark-circle';
  }

  switch (type) {
    case 'lesson':
      return status === 'active' ? 'play-circle' : 'lock-closed';
    case 'quiz':
      return status === 'active' ? 'help-circle' : 'lock-closed';
    case 'test':
      return status === 'active' ? 'document-text' : 'lock-closed';
    default:
      return 'lock-closed';
  }
};

export const isLessonAccessible = (status: string): boolean => {
  return status === 'completed' || status === 'active';
};
