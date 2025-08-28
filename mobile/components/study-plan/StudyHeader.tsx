import { View, Text } from 'react-native'
import React from 'react'
import { useStudyPlanData } from '~/hooks/useStudyPlanData';
import { useProgressAnimation } from '~/hooks/useStudyPlanAnimations';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS } from '~/constants/StudyPlan';
import { colors } from '~/constants/Color';

interface StudyHeaderProps {
  dailyGoal: ReturnType<typeof useStudyPlanData>['dailyGoal'];
}

export const StudyHeader = React.memo<StudyHeaderProps>(({ dailyGoal }) => {
  const progressPercentage = (dailyGoal.todayXP / dailyGoal.targetXP) * 100;
  const progressAnimatedStyle = useProgressAnimation(progressPercentage);

  return (
    <View className="border-b border-gray-100 bg-white px-6 py-6">
      {/* Streak */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Animated.View
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-orange-500 shadow-sm"
            style={SHADOWS.flame}>
            <Ionicons name="flame" size={22} color="white" />
          </Animated.View>
          <View>
            <Text className="text-xl font-bold text-gray-800">{dailyGoal.streak}</Text>
            <Text className="text-sm text-gray-500">ngày liên tiếp</Text>
          </View>
        </View>
        <View className="flex-row items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-2">
          <Ionicons name="star" size={18} color={colors.warning} />
          <Text className="ml-1 text-lg font-bold text-gray-800">{dailyGoal.todayXP} XP</Text>
        </View>
      </View>

      {/* Daily Goal Progress */}
      <View>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-gray-700">Mục tiêu hàng ngày</Text>
          <Text className="text-sm font-medium text-gray-600">
            {dailyGoal.todayXP}/{dailyGoal.targetXP} XP
          </Text>
        </View>
        <View className="h-4 overflow-hidden rounded-full bg-gray-200">
          <Animated.View
            className="shadow-inner h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500"
            style={progressAnimatedStyle}
          />
        </View>
        {progressPercentage >= 100 && (
          <View className="mt-2 flex-row items-center justify-center">
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text className="ml-1 text-sm font-medium text-green-600">
              Hoàn thành mục tiêu hôm nay! 🎉
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});