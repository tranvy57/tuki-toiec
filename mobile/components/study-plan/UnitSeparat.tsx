import React from "react";
import { Text, View } from "react-native";

interface UnitSeparatorProps {
  unit: number;
}

export const UnitSeparator = React.memo<UnitSeparatorProps>(({ unit }) => {
  return (
    <View className="my-6 flex-row items-center px-6">
      <View className="h-px flex-1 bg-gray-300" />
      <View className="mx-4 rounded-full border-2 border-gray-300 bg-white px-4 py-2">
        <Text className="font-bold text-gray-600">Unit {unit}</Text>
      </View>
      <View className="h-px flex-1 bg-gray-300" />
    </View>
  );
});
