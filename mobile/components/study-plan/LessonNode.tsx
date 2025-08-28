import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { colors } from "~/constants/Color";
import { LAYOUT, SCREEN_WIDTH, SHADOWS } from "~/constants/StudyPlan";
import { useNodeAnimation } from "~/hooks/useStudyPlanAnimations";
import { LessonNode } from "~/types/example";
import { getStatusColor, getStatusIcon, isLessonAccessible } from "~/utils/studyPlanHelpers";

interface LessonNodeProps {
  node: LessonNode;
  index: number;
  isLeft: boolean;
  onLessonPress: (lessonId: string) => void;
  onLessonStart: (lessonId: string) => void;
}

export const LessonNodeComponent = React.memo<LessonNodeProps>(
  ({ node, index, isLeft, onLessonPress, onLessonStart }) => {
    const animatedStyle = useNodeAnimation(index);
    const nodeColor = getStatusColor(node.status);
    const iconName = getStatusIcon(node.type, node.status);
    const isAccessible = isLessonAccessible(node.status);

    const handleLessonPress = React.useCallback(() => {
      if (isAccessible) {
        onLessonPress(node.id);
      }
    }, [isAccessible, onLessonPress, node.id]);

    const handleLessonStart = React.useCallback(() => {
      if (isAccessible) {
        onLessonStart(node.id);
      }
    }, [isAccessible, onLessonStart, node.id]);

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

        {/* Node Circle */}
        <Pressable
          className="mb-3 h-16 w-16 items-center justify-center rounded-full"
          style={[
            {
              backgroundColor: nodeColor,
              shadowColor: nodeColor,
            },
            SHADOWS.node,
          ]}
          onPress={handleLessonStart}
          disabled={!isAccessible}
          accessibilityRole="button"
          accessibilityLabel={`${node.title} - ${node.status}`}
          accessibilityHint={
            isAccessible ? 'Nhấn để bắt đầu bài học' : 'Bài học chưa được mở khóa'
          }>
          <Ionicons name={iconName as any} size={32} color="white" />
        </Pressable>

        {/* <TouchableOpacity
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-md"
          style={[
            {
              maxWidth: SCREEN_WIDTH * LAYOUT.CARD_MAX_WIDTH_RATIO,
              minWidth: SCREEN_WIDTH * LAYOUT.CARD_MIN_WIDTH_RATIO,
            },
            SHADOWS.card,
          ]}
          onPress={handleLessonPress}
          disabled={!isAccessible}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Chi tiết bài học: ${node.title}`}
          accessibilityHint={
            isAccessible ? 'Nhấn để xem chi tiết bài học' : 'Bài học chưa được mở khóa'
          }>
          <Text className="mb-1 text-base font-bold text-gray-800">{node.title}</Text>
          {node.subtitle && <Text className="mb-2 text-sm text-gray-600">{node.subtitle}</Text>}

          <View className="mb-2 flex-row flex-wrap">
            {node.skills.slice(0, 2).map((skill, idx) => (
              <View key={idx} className="mb-1 mr-1 rounded-full bg-blue-100 px-2 py-1">
                <Text className="text-xs font-medium text-blue-600">{skill}</Text>
              </View>
            ))}
            {node.skills.length > 2 && (
              <View className="mb-1 mr-1 rounded-full bg-gray-100 px-2 py-1">
                <Text className="text-xs font-medium text-gray-600">+{node.skills.length - 2}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity> */}
      </Animated.View>
    );
  }
);
