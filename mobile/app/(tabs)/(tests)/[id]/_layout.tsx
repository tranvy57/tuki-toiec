import { Stack, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TestLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="question"
          options={{
            // có thể thêm animation
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="review-part"
          options={{
            // có thể thêm animation
            presentation: 'modal',
          }}
        />
      </Stack>
      
    </GestureHandlerRootView>
  );
}
