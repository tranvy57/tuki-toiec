import { Stack, useLocalSearchParams } from 'expo-router';

export default function TestLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[q]"
        options={{
          // có thể thêm animation
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
