import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '~/constants/Color';

interface GestureWrapperProps {
  children: React.ReactNode;
  panGesture: ReturnType<typeof Gesture.Pan>;
  animatedStyle: any;
  contentAnimatedStyle: any;
}

export const GestureWrapper: React.FC<GestureWrapperProps> = ({
  children,
  panGesture,
  animatedStyle,
  contentAnimatedStyle,
}) => {
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
            },
            animatedStyle,
          ]}>
          <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
