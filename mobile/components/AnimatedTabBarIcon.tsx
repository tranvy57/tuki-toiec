import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from '../constants/Color';
import { TabAnimations, AnimationDurations } from '../constants/Animation';

interface AnimatedTabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
  size?: number;
}

export const AnimatedTabBarIcon: React.FC<AnimatedTabBarIconProps> = ({
  name,
  color,
  focused,
  size = 24,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Parallel animations for better performance
      Animated.parallel([
        // Scale animation with spring
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          ...TabAnimations.spring,
        }),
        // Glow opacity animation (non-native driver for opacity)
        Animated.timing(glowOpacityAnim, {
          toValue: 1,
          duration: AnimationDurations.normal,
          useNativeDriver: false,
        }),
      ]).start();

      // Bounce animation sequence (separate to avoid conflicts)
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: AnimationDurations.fast,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          ...TabAnimations.bounce,
        }),
      ]).start();
    } else {
      // Reset all animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...TabAnimations.spring,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: AnimationDurations.fast,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacityAnim, {
          toValue: 0,
          duration: AnimationDurations.normal,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [focused, scaleAnim, bounceAnim, glowOpacityAnim]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow effect background */}
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: `${colors.brandCoral200}99`,
          borderRadius: '50%',
          opacity: glowOpacityAnim,
          width: 43,
          height: 43,
        }}
      />
      
      
      {/* Icon with all transform animations */}
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim },
          ],
        }}
      >
        <FontAwesome
          name={name}
          size={size}
          color={focused ? colors.primary : color}
          style={{
            textShadowColor: focused ? colors.brandCoral300 : 'transparent',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: focused ? 3 : 0,
          }}
        />
      </Animated.View>
    </View>
  );
};
