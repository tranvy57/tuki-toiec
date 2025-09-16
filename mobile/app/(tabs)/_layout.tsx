import { Tabs } from 'expo-router';

import { AnimatedTabBarIcon } from '../../components/AnimatedTabBarIcon';
import { colors } from '../../constants/Color';
import { EnhancedTabBar } from '~/components/EnhancedTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';


export default function TabLayout() {


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        initialRouteName="home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.primary,
          tabBarShowLabel: true,
          tabBarInactiveTintColor: colors.warmGray500,
          // tabBarStyle: {
          //   backgroundColor: colors.background,
          //   borderTopColor: colors.border,
          //   borderTopWidth: StyleSheet.hairlineWidth,
          //   paddingBottom: 8,
          //   paddingTop: 8,
          //   height: 80,
          //   position: 'absolute',
          //   bottom: 0,
          //   left: 0,
          //   right: 0,
          // },
          // tabBarLabelStyle: {
          //   fontSize: 12,
          //   fontWeight: '500',
          //   marginTop: 4,
          //   textAlign: 'center',
          // },
          // tabBarItemStyle: {
          //   paddingVertical: 4,
          //   borderRadius: 12,
          //   marginHorizontal: 2,
          //   transition: 'all 0.3s ease-in-out',
          // },
          // Add smooth transitions
          animation: 'shift',
          lazy: false,
          tabBarHideOnKeyboard: true,
        })}
        tabBar={(props: BottomTabBarProps) => <EnhancedTabBar {...props} />}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <AnimatedTabBarIcon name="home" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(tests)"
          options={{
            title: 'Thi thử',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <AnimatedTabBarIcon name="file-text" color={color} focused={focused} />
            ),

            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="vocabulary"
          options={{
            title: 'Từ vựng',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <AnimatedTabBarIcon name="book" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="study-plan"
          options={{
            title: 'Kế hoạch',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <AnimatedTabBarIcon name="calendar" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Hồ sơ',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <AnimatedTabBarIcon name="user" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
