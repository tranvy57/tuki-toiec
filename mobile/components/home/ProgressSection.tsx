import { View, Text } from 'react-native';
import { colors } from '~/constants/Color';

export const ProgressSection = () => {
  return (
    <>
      <Text className="mb-4 text-lg font-bold text-foreground">Tiến độ bao đỗ</Text>
      <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="mr-4 rounded-lg bg-white p-3 shadow-sm">
            <Text className="text-center font-bold text-foreground">Ngày</Text>
            <Text className="text-center font-bold text-foreground">1 - 6</Text>
          </View>
          <View className="flex-1">
            <View className="mb-2 flex-row items-center">
              <View
                className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary }}>
                <Text className="text-xs text-white">🏔️</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-foreground">Mô tả hình ảnh</Text>
                <Text className="text-sm text-muted">Mục tiêu: 6 điểm</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
