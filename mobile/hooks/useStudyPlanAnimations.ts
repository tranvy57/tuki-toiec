import React from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ANIMATION_CONFIG } from '~/constants/StudyPlan';

export const useProgressAnimation = (progressPercentage: number) => {
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withSpring(progressPercentage, ANIMATION_CONFIG.PROGRESS_SPRING_CONFIG);
  }, [progressPercentage, progressWidth]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progressWidth.value, 100)}%`,
  }));

  return progressAnimatedStyle;
};

export const useNodeAnimation = (index: number) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const delay = index * ANIMATION_CONFIG.STAGGER_DELAY;
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, ANIMATION_CONFIG.SPRING_CONFIG);
      opacity.value = withSpring(1, ANIMATION_CONFIG.SPRING_CONFIG);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};
