import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '~/constants/Color';

const EndMessage = React.memo(() => {
  return (
    <View className="items-center px-6 py-8">
      <View className="items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <Ionicons name="telescope" size={48} color={colors.primary} />
        <Text className="mt-3 text-center text-lg font-bold text-gray-800">
          Thêm bài học sắp ra mắt!
        </Text>
        <Text className="mt-2 text-center text-gray-600">
          Tiếp tục học để mở khóa những bài học mới
        </Text>
      </View>
    </View>
  );
});

EndMessage.displayName = 'EndMessage';

export default EndMessage;
