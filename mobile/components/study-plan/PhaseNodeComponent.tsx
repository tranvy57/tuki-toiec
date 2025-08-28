import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '~/constants/Color';
import { LAYOUT, SCREEN_WIDTH, SHADOWS } from '~/constants/StudyPlan';
import { useNodeAnimation } from '~/hooks/useStudyPlanAnimations';
import { Phase } from '~/types/studyPlan';
import {
  getPhaseStatusColor,
  getPhaseStatusIcon,
  isPhaseAccessible,
  getPhaseDescription,
} from '~/utils/studyPlanHelpers';

interface PhaseNodeProps {
  phase: Phase;
  index: number;
  isLeft: boolean;
  onPhasePress: (phaseId: string) => void;
  onPhaseStart: (phaseId: string) => void;
}

export const PhaseNodeComponent = React.memo<PhaseNodeProps>(
  ({ phase, index, isLeft, onPhasePress, onPhaseStart }) => {
    const animatedStyle = useNodeAnimation(index);
    const nodeColor = getPhaseStatusColor(phase.status);
    const iconName = getPhaseStatusIcon(phase.status);
    const isAccessible = isPhaseAccessible(phase.status);
    const lessonDescription = getPhaseDescription(phase.lessons.length);

    const handlePhasePress = React.useCallback(() => {
      if (isAccessible) {
        onPhasePress(phase.phase_id);
      }
    }, [isAccessible, onPhasePress, phase.phase_id]);

    const handlePhaseStart = React.useCallback(() => {
      if (isAccessible) {
        onPhaseStart(phase.phase_id);
      }
    }, [isAccessible, onPhaseStart, phase.phase_id]);

    return (
      <Animated.View
        className="mb-8"
        style={[
          {
            alignItems: isLeft ? 'flex-start' : 'flex-end',
            paddingLeft: isLeft ? LAYOUT.NODE_PADDING : SCREEN_WIDTH * 0.5,
            paddingRight: isLeft ? SCREEN_WIDTH * 0.5 : LAYOUT.NODE_PADDING,
          },
          animatedStyle,
        ]}>
        {/* Connection Line */}
        {index > 0 && (
          <View
            className="absolute"
            style={{
              top: -LAYOUT.CONNECTION_OFFSET,
              [isLeft ? 'left' : 'right']: LAYOUT.NODE_SIZE,
              width: SCREEN_WIDTH * 0.3,
              height: LAYOUT.CONNECTION_OFFSET,
              transform: [{ scaleX: isLeft ? 1 : -1 }],
            }}>
            <View
              className="absolute top-4"
              style={{
                width: '100%',
                height: LAYOUT.CONNECTION_LINE_HEIGHT,
                backgroundColor: colors.warmGray300,
                borderRadius: 1,
              }}
            />
          </View>
        )}

        {/* Phase Number Badge */}
        <View
          className="absolute -top-2 items-center justify-center rounded-full bg-white"
          style={{
            width: 28,
            height: 28,
            [isLeft ? 'left' : 'right']: LAYOUT.NODE_SIZE - 14,
            borderColor: nodeColor,
            borderWidth: 2,
            zIndex: 10,
          }}>
          <Text className="text-xs font-bold" style={{ color: nodeColor }}>
            {phase.order_no}
          </Text>
        </View>

        {/* Node Circle */}
        <Pressable
          className="mb-3 h-16 w-16 items-center justify-center rounded-full"
          style={[
            {
              backgroundColor: nodeColor,
              shadowColor: nodeColor,
              opacity: isAccessible ? 1 : 0.6,
            },
            SHADOWS.node,
          ]}
          onPress={handlePhaseStart}
          disabled={!isAccessible}
          accessibilityRole="button"
          accessibilityLabel={`${phase.title} - ${phase.status}`}
          accessibilityHint={
            isAccessible ? 'Nhấn để bắt đầu giai đoạn học' : 'Giai đoạn chưa được mở khóa'
          }>
          <Ionicons name={iconName as any} size={32} color="white" />
        </Pressable>

        {/* Phase Info Card */}
        <TouchableOpacity
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-md"
          style={[
            {
              maxWidth: SCREEN_WIDTH * LAYOUT.CARD_MAX_WIDTH_RATIO,
              minWidth: SCREEN_WIDTH * LAYOUT.CARD_MIN_WIDTH_RATIO,
              opacity: isAccessible ? 1 : 0.7,
            },
            SHADOWS.card,
          ]}
          onPress={handlePhasePress}
          disabled={!isAccessible}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Chi tiết giai đoạn: ${phase.title}`}
          accessibilityHint={
            isAccessible ? 'Nhấn để xem chi tiết giai đoạn học' : 'Giai đoạn chưa được mở khóa'
          }>
          {/* Status Badge */}
          <View className="absolute -right-2 -top-2">
            <View
              className="rounded-full px-2 py-1"
              style={{
                backgroundColor: isAccessible ? 'green' : colors.warmGray100,
              }}>
              <Text
                className="text-xs font-medium"
                style={{
                  color: isAccessible ? 'green' : colors.warmGray500,
                }}>
                {isAccessible ? 'Khả dụng' : 'Đã khóa'}
              </Text>
            </View>
          </View>

          <Text className="mb-1 text-base font-bold text-gray-800">{phase.title}</Text>

          <Text className="mb-3 text-sm text-gray-600">{lessonDescription}</Text>

          {/* Lesson Preview */}
          <View className="flex-row flex-wrap">
            {phase.lessons.slice(0, 3).map((lessonId, idx) => (
              <View key={lessonId} className="mb-1 mr-1 rounded-full bg-blue-100 px-2 py-1">
                <Text className="text-xs font-medium text-blue-600">Bài {lessonId}</Text>
              </View>
            ))}
            {phase.lessons.length > 3 && (
              <View className="mb-1 mr-1 rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs font-medium text-gray-600">
                  +{phase.lessons.length - 3}
                </Text>
              </View>
            )}
          </View>

          {/* Progress Indicator */}
          {isAccessible && (
            <View className="mt-3 flex-row items-center">
              <Ionicons name="arrow-forward-circle" size={16} color='blue' />
              <Text className="ml-2 text-xs font-medium text-blue-600">Bắt đầu học</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);
