// components/TabScene.tsx
import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function TabScene({ children }: { children: React.ReactNode }) {
  const isFocused = useIsFocused();
  const x = useSharedValue(0);
  const o = useSharedValue(1);

  useEffect(() => {
    // vào tab: slide từ 20 -> 0, fade 0 -> 1; rời tab làm ngược lại
    x.value = withTiming(isFocused ? 0 : 20, { duration: 220 });
    o.value = withTiming(isFocused ? 1 : 0, { duration: 180 });
  }, [isFocused]);

  const r = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    opacity: o.value,
  }));

  return <Animated.View style={[{ flex: 1 }, r]}>{children}</Animated.View>;
}
