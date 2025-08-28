import { LessonStatus, NodeType } from '~/types/example';
import { STATUS_COLORS, STATUS_ICONS, TYPE_ICONS } from '~/constants/StudyPlan';

export const getStatusColor = (status: LessonStatus): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.locked;
};

export const getStatusIcon = (type: NodeType, status: LessonStatus): string => {
  // Priority: status-specific icons first
  if (status in STATUS_ICONS) {
    return STATUS_ICONS[status as keyof typeof STATUS_ICONS];
  }
  
  // Fallback to type-specific icons
  return TYPE_ICONS[type] || TYPE_ICONS.lesson;
};

export const isLessonAccessible = (status: LessonStatus): boolean => {
  return status === 'next' || status === 'in_progress';
};
