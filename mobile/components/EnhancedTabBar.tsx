// EnhancedTabBar.tsx
import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '~/constants/Color';
import { BlurView } from 'expo-blur';
import { useSegments } from 'expo-router';

const INDICATOR_H = 2;
// constants "compact"
const BAR_H = 60; // chiều cao tab bar mong muốn (không tính insets)
const ICON_SIZE = 22; // kích thước icon
const ICON_BOX_H = 28; // vùng cao dành cho icon (không tính label)

export const EnhancedTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const progress = useSharedValue(state.index);
  const segments = useSegments();
  const page = segments[segments.length - 1];
  const pagesToHideTabBar = ['[q]', 'result'];
  const isHidden = pagesToHideTabBar.includes(page);


  // cập nhật animation khi index đổi
  React.useEffect(() => {
    progress.value = withTiming(state.index, { duration: 250 });
  }, [state.index]);

  // chiều rộng container sẽ quyết định tabWidth
  const [width, setWidth] = React.useState(0);

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[
        styles.container,
        {
          opacity: isHidden ? 0 : 1,
          height: isHidden ? 0 : BAR_H + 8,
        }
      ]}>
      {/* Nền blur + overlay màu */}
      <View style={styles.tabBarBackground}>
        <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: `${colors.brandCoral300}CC`, // ~80% opacity
              borderTopColor: colors.border,
              borderTopWidth: StyleSheet.hairlineWidth,
            },
          ]}
        />
      </View>

      {/* Các tab */}
      <View style={[styles.tabRow, { height: BAR_H }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          const color = isFocused
            ? (options.tabBarActiveTintColor ?? '#fff')
            : (options.tabBarInactiveTintColor ?? 'rgba(255,255,255,0.75)');

          // Bubble highlight khi active
          const v = useSharedValue(isFocused ? 1 : 0);
          React.useEffect(() => {
            v.value = withTiming(isFocused ? 1 : 0, { duration: 220 });
          }, [isFocused]);

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              hitSlop={8}>
              {/* ICON BOX: bubble nằm trong box này nên không tràn */}
              <View style={{ height: ICON_BOX_H, alignItems: 'center', justifyContent: 'center' }}>
                {/* <Animated.View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    width: BUBBLE_D,
                    height: BUBBLE_D,
                    borderRadius: BUBBLE_D / 2,
                    backgroundColor: '#FFFFFF',
                    opacity: 0.22, // an toàn nếu animation chưa kịp chạy
                  }}
                /> */}
                {options.tabBarIcon?.({ focused: isFocused, color, size: ICON_SIZE })}
              </View>

              {options.tabBarShowLabel && (
                <Animated.Text
                  style={[
                    styles.label,
                    { color },
                    // ẩn label khi focus
                    { opacity: isFocused ? 0 : 1 },
                  ]}
                  numberOfLines={1}>
                  {label as string}
                </Animated.Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
    paddingTop: 8,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF8A80CC',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#ff776f',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // hộp riêng cho icon
  iconBox: {
    height: ICON_BOX_H,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  label: { fontSize: 11, fontWeight: '500', marginTop: 2 },
});

