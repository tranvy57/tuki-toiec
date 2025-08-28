import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import TabScene from '~/components/TabScene';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { colors } from '~/constants/Color';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { SCREEN_WIDTH, LAYOUT, SHADOWS } from '~/constants/StudyPlan';
import { useProgressAnimation, useNodeAnimation } from '~/hooks/useStudyPlanAnimations';
import { getStatusColor, getStatusIcon, isLessonAccessible } from '~/utils/studyPlanHelpers';
import EndMessage from '~/components/study-plan/EndMessage';
import { useStudyPlanData, type Row } from '~/hooks/useStudyPlanData';
import { useStudyPlanActions } from '~/hooks/useStudyPlanActions';
import { StudyHeader } from '~/components/study-plan/StudyHeader';
import { LessonNodeComponent } from '~/components/study-plan/LessonNode';
import { UnitSeparator } from '~/components/study-plan/UnitSeparat';
import { mockPlan } from '~/constants/example';


export default function StudyPlan() {
  const { rows, dailyGoal, keyExtractor, getItemType, stickyHeaderIndices, shouldItemUpdate } = useStudyPlanData(mockPlan);
  const { handleLessonPress, handleLessonStart } = useStudyPlanActions();

  const renderItem: ListRenderItem<Row> = React.useCallback(
    ({ item }) => {
      if (item.type === 'unit') {
        return <UnitSeparator unit={item.unit} />;
      }
      return (
        <LessonNodeComponent
          node={item.node}
          index={item.lessonIndex}
          isLeft={item.isLeft}
          onLessonPress={handleLessonPress}
          onLessonStart={handleLessonStart}
        />
      );
    },
    [handleLessonPress, handleLessonStart]
  );

  return (
    <TabScene>
      <View className="flex-1 bg-gray-50">
        <StudyHeader dailyGoal={dailyGoal} />

        <FlashList
          data={rows}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          estimatedItemSize={140}
          stickyHeaderIndices={stickyHeaderIndices}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: LAYOUT.CONTAINER_PADDING }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={EndMessage}
        />
      </View>
    </TabScene>
  );
}
