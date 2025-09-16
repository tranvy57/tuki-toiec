import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../helpers/fetchLogger';  // patch fetch trước khi render app


import '../global.css';
import { getValueFor } from '~/libs/secure-store';

SplashScreen.preventAutoHideAsync();



const queryClient = new QueryClient();

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await Promise.all([
        getValueFor('token').then(setToken),
        new Promise((r) => setTimeout(r, 1200)),
      ]);
      setReady(true);
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack
          initialRouteName={token ? '(tabs)' : '(auth)'}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
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
