export const LoadingComponent = require('../public/animation/loading-component.json');
export const LoadingPage = require('../public/animation/loading-page.json');

// Tab Animation Configs
export const TabAnimations = {
  spring: {
    tension: 150,
    friction: 8,
    useNativeDriver: true,
  },
  timing: {
    duration: 250,
    useNativeDriver: true,
  },
  bounce: {
    tension: 120,
    friction: 7,
    useNativeDriver: true,
  },
};

// Common Animation Durations
export const AnimationDurations = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
};

// Easing functions for smooth animations
export const AnimationEasing = {
  easeInOut: 'ease-in-out',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  linear: 'linear',
};