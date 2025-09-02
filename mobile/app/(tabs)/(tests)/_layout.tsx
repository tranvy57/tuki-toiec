import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          // có thể thêm animation
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
