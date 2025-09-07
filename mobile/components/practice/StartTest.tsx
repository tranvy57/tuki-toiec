import { AntDesign } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '~/constants/Color';

interface TestStartScreenProps {
  testTitle: string;
  testId: string;
  onStartTest: () => void;
  onGoBack: () => void;
}

export default function TestStartScreen({
  testTitle,
  testId,
  onStartTest,
  onGoBack,
}: TestStartScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b px-4 py-3"
        style={{ borderColor: colors.border }}>
        <TouchableOpacity
          onPress={onGoBack}
          className="flex-row items-center rounded-lg px-3 py-2"
          style={{ backgroundColor: colors.warmGray100 }}>
          <AntDesign name="left" size={18} color={colors.warmGray700} />
          <Text className="ml-1 text-sm font-medium" style={{ color: colors.warmGray700 }}>
            Quay lại
          </Text>
        </TouchableOpacity>

        <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
          Bắt đầu bài test
        </Text>

        {/* placeholder để cân bằng justify-between */}
        <View style={{ width: 60 }} />
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center px-6 py-8">
        {/* Info card */}
        <View
          className="mb-8 rounded-2xl p-8 shadow-sm"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}>
          <View className="mb-6 items-center">
            <View
              className="mb-4 h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.brandCoral100 }}>
              <Text className="text-2xl">📝</Text>
            </View>
            <Text className="mb-1 text-sm" style={{ color: colors.mutedForeground }}>
              Test ID: {testId}
            </Text>
            <Text
              className="text-center text-xl font-bold leading-6"
              style={{ color: colors.foreground }}>
              {testTitle}
            </Text>
          </View>

          <View className="gap-y-3">
            <View className="flex-row items-center">
              <View
                className="mr-3 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.success }}
              />
              <Text style={{ color: colors.mutedForeground }}>Thời gian: 120 phút</Text>
            </View>
            <View className="flex-row items-center">
              <View
                className="mr-3 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.info }}
              />
              <Text style={{ color: colors.mutedForeground }}>
                200 câu hỏi (Listening + Reading)
              </Text>
            </View>
            <View className="flex-row items-center">
              <View
                className="mr-3 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.warning }}
              />
              <Text style={{ color: colors.mutedForeground }}>Điểm tối đa: 990</Text>
            </View>
          </View>
        </View>

        {/* Question */}
        <Text
          className="mb-8 text-center text-xl font-semibold leading-7"
          style={{ color: colors.foreground }}>
          Bạn có muốn bắt đầu làm bài test này không?
        </Text>

        {/* Actions */}
        <View className="gap-y-4">
          <TouchableOpacity
            onPress={onStartTest}
            className="rounded-xl px-6 py-4 shadow-sm"
            style={{ backgroundColor: colors.brandCoral }}>
            <Text
              className="text-center text-lg font-semibold"
              style={{ color: colors.primaryForeground }}>
              Bắt đầu ngay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGoBack}
            className="rounded-xl border px-6 py-4"
            style={{ borderColor: colors.border }}>
            <Text className="text-center text-lg font-medium" style={{ color: colors.warmGray700 }}>
              Để sau
            </Text>
          </TouchableOpacity>
        </View>

        {/* Note */}
        <View className="mt-8 rounded-xl p-4" style={{ backgroundColor: colors.brandCoral50 }}>
          <Text className="mb-2 text-sm font-semibold" style={{ color: colors.brandCoral700 }}>
            💡 Lưu ý:
          </Text>
          <Text className="text-sm leading-5" style={{ color: colors.brandCoral600 }}>
            Hãy chuẩn bị tai nghe và tìm một không gian yên tĩnh để có trải nghiệm tốt nhất.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
