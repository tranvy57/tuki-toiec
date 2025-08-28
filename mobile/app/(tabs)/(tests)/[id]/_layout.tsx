import { Stack } from 'expo-router';

export default function TestLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="[q]" /> 
      <Stack.Screen name="result" />
    </Stack>
  );
}
