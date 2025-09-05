import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../helpers/fetchLogger';  // patch fetch trước khi render app


import '../global.css';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
  screenOptions: { headerShown: false },
};
const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // giả lập load dữ liệu (vd: token, fonts, db…)
      await new Promise((r) => setTimeout(r, 1200));
      setReady(true);
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!ready) {
    // Trong lúc chờ -> vẫn hiển thị splash mặc định
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>

      <Animated.View style={styles.loading} entering={FadeIn.duration(800)}>
        <Text style={styles.text}>Smart TOEIC Learner 🚀</Text>
      </Animated.View>

      <Stack {...unstable_settings}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF776F',
  },
});
