import { Stack, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SkillLayout() {
    const { skill } = useLocalSearchParams() as { skill?: string };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ title: `Ôn luyện ${skill}` }}
                />
                <Stack.Screen
                    name="test-[id]"
                    options={{ title: "Làm bài kiểm tra" }}
                />
                <Stack.Screen
                    name="result"
                    options={{ title: "Kết quả" }}
                />
            </Stack>
        </GestureHandlerRootView>

    );
}