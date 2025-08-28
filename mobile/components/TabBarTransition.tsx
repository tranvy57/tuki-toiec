import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { colors } from '../constants/Color';

interface TabBarTransitionProps {
  activeIndex: number;
  totalTabs: number;
}

export const TabBarTransition: React.FC<TabBarTransitionProps> = ({
  activeIndex,
  totalTabs,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Slide animation
    Animated.spring(slideAnim, {
      toValue: activeIndex,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();

    // Scale animation for active indicator
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeIndex, slideAnim, scaleAnim]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, totalTabs - 1],
    outputRange: [0, (100 / totalTabs) * (totalTabs - 1)],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            width: `${100 / totalTabs}%`,
            transform: [
              { 
                translateX: slideAnim.interpolate({
                  inputRange: [0, totalTabs - 1],
                  outputRange: [0, 100 * (totalTabs - 1)],
                  extrapolate: 'clamp',
                })
              },
              { scale: scaleAnim },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    shadowColor: colors.brandCoral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

