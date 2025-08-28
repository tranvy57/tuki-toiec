import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';
import EndMessage from '~/components/study-plan/EndMessage';
import { PhaseNodeComponent } from '~/components/study-plan/PhaseNodeComponent';
import { StudyHeader } from '~/components/study-plan/StudyHeader';
import TabScene from '~/components/TabScene';
import { mockPhases } from '~/constants/data_phases';
import { LAYOUT } from '~/constants/StudyPlan';
import { useStudyPlanActions } from '~/hooks/useStudyPlanActions';
import { Phase } from '~/types/studyPlan';

const data = mockPhases;

export default function StudyPlan() {
  // const { rows, dailyGoal, keyExtractor, getItemType, stickyHeaderIndices, shouldItemUpdate } = useStudyPlanData(mockPlan);
  const { handleLessonPress, handleLessonStart } = useStudyPlanActions();
  const handlePhasePress = (phaseId: string) => {
    console.log('Phase pressed:', phaseId);
    // Handle phase details navigation
  };

  const handlePhaseStart = (phaseId: string) => {
    console.log('Phase started:', phaseId);
    // Handle starting the phase
  };
  const renderItem: ListRenderItem<Phase> = React.useCallback(
    ({ item, index }) => {
      // if (item.type === 'unit') {
      //   return <UnitSeparator unit={item.unit} />;
      // }
      console.log(item)
      return (
        <PhaseNodeComponent
          key={item.phase_id}
          phase={item}
          index={index}
          isLeft={index % 2 === 0}
          onPhasePress={handlePhasePress}
          onPhaseStart={handlePhaseStart}
        />
      );
    },
    [handleLessonPress, handleLessonStart]
  );

  return (
    <TabScene>
      <View className="flex-1 bg-gray-50">
        <StudyHeader />

        <FlashList
          data={data}
          renderItem={renderItem}
          // getItemType={getItemType}
          estimatedItemSize={140}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: LAYOUT.CONTAINER_PADDING }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={EndMessage}
        />
      </View>
    </TabScene>
  );
}
