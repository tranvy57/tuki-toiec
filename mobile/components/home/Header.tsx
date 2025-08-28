import { View, Text, Pressable } from 'react-native';
import { colors } from '~/constants/Color';

export const Header = () => {
  return (
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={{ backgroundColor: colors.primary, paddingTop: 30 }}>
      <View className="flex-1 items-center">
        <Text className="text-lg font-bold text-white">Tuki TOEIC®</Text>
      </View>
      <Pressable className="p-2">
        <Text className="text-xl text-white">☰</Text>
      </Pressable>
    </View>
  );
};
