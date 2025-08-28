import { Dimensions } from 'react-native';
import { colors } from './Color';

export const SCREEN_WIDTH = Dimensions.get('window').width;

// Animation constants
export const ANIMATION_CONFIG = {
  STAGGER_DELAY: 100,
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 100,
  },
  PROGRESS_SPRING_CONFIG: {
    damping: 20,
    stiffness: 100,
  },
} as const;

// Layout constants
export const LAYOUT = {
  NODE_PADDING: 20,
  NODE_SIZE: 64,
  CONNECTION_LINE_HEIGHT: 2,
  CONNECTION_OFFSET: 32,
  CARD_MAX_WIDTH_RATIO: 0.4,
  CARD_MIN_WIDTH_RATIO: 0.35,
  CONTAINER_PADDING: 100,
} as const;

// Status color mapping
export const STATUS_COLORS = {
  done: colors.success,
  mastered: colors.success,
  in_progress: colors.primary,
  next: colors.info,
  locked: colors.warmGray400,
} as const;

// Icon mapping
export const STATUS_ICONS = {
  locked: 'lock-closed',
  done: 'checkmark-circle',
  mastered: 'checkmark-circle',
  in_progress: 'play-circle',
} as const;

export const TYPE_ICONS = {
  review: 'refresh-circle',
  checkpoint: 'trophy',
  chest: 'gift',
  lesson: 'book',
} as const;

// Shadow styles
export const SHADOWS = {
  node: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flame: {
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;
