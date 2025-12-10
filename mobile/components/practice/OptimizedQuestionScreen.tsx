import { useRouter } from 'expo-router';
import type React from 'react';
import { useMemo, useCallback, useState } from 'react';
import { Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { ScrollView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '~/constants/Color';
import { useCurrentTest } from '~/hooks/useCurrentTest';
import { AnswerOptions } from './AnswerOptions';
import { QuestionContent } from './QuestionContent';
import { QuestionHeader } from './QuestionHeader';
import { useAddAttemptAnswer } from '~/api/attempts/useStartAttempt';

const { width } = Dimensions.get('window');

export const OptimizedQuestionScreen: React.FC = () => {
  const router = useRouter();

  const currentGroup = useCurrentTest((state) => state.currentGroup);
  const selectedAnswers = useCurrentTest((state) => state.selectedAnswers);
  const nextGroup = useCurrentTest((state) => state.nextGroup);
  const beforeGroup = useCurrentTest((state) => state.beforeGroup);
  const setAnswer = useCurrentTest((state) => state.setAnswer);
  const fullTest = useCurrentTest((state) => state.fullTest);

  const {mutateAsync, isSuccess, isError} = useAddAttemptAnswer();

  const [isLoading, setIsLoading] = useState(false);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const switchQuestion = useCallback(
    (direction: 'next' | 'prev') => {
      setIsLoading(true); // bật loading khi bắt đầu slide

      const target = direction === 'next' ? -width : width;
      translateX.value = withTiming(target, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 }, (finished) => {
        if (finished) {
          if (direction === 'next') runOnJS(nextGroup)();
          else runOnJS(beforeGroup)();

          translateX.value = direction === 'next' ? width : -width;
          opacity.value = 0;

          translateX.value = withTiming(0, { duration: 250 });
          opacity.value = withTiming(1, { duration: 250 }, () => {
            runOnJS(setIsLoading)(false); 
          });
        }
      });
    },
    [nextGroup, beforeGroup]
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (event.translationX < -80) {
        runOnJS(switchQuestion)('next');
      } else if (event.translationX > 80) {
        runOnJS(switchQuestion)('prev');
      } else {
        translateX.value = withTiming(0);
      }
    });

  const handleSelectAnswer = useCallback(
    async (questionId: string, answerId: string) => {
      const temp = selectedAnswers[questionId];
      setAnswer(questionId, answerId);

      await mutateAsync({ questionId, answerId, attemptId: fullTest?.id || '' });
      if (isError) {
        console.error('Failed to save answer');
        alert('Failed to save answer. Please try again.');
        setAnswer(questionId, temp);
        return;
      }
    },
    [setAnswer]
  );

  const questionInfo = useMemo(() => {
    if (!currentGroup)
      return {
        currentQuestionNumber: undefined,
        orderIndex: 0,
        hasPrevious: false,
        hasNext: false,
      };

    return {
      currentQuestionNumber: currentGroup.questions[0]?.numberLabel,
      orderIndex: currentGroup.orderIndex ?? 0,
      hasPrevious: (currentGroup.orderIndex ?? 0) > 1,
      hasNext: (currentGroup.orderIndex ?? 0) < 200,
    };
  }, [currentGroup?.orderIndex, currentGroup?.questions]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  if (!currentGroup) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}>
        <Text className="text-lg text-gray-500">Loading question...</Text>
      </View>
    );
  }
  if(isLoading) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <QuestionHeader
          currentQuestionNumber={questionInfo.currentQuestionNumber}
          totalQuestions={200}
          onGoBack={() => router.back()}
          onPrevious={() => switchQuestion('prev')}
          onNext={() => switchQuestion('next')}
          hasPrevious={questionInfo.hasPrevious}
          hasNext={questionInfo.hasNext}
        />
        <View className="absolute inset-0 items-center justify-center bg-black/10">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }
      
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <QuestionHeader
        currentQuestionNumber={questionInfo.currentQuestionNumber}
        totalQuestions={200}
        onGoBack={() => router.back()}
        onPrevious={() => switchQuestion('prev')}
        onNext={() => switchQuestion('next')}
        hasPrevious={questionInfo.hasPrevious}
        hasNext={questionInfo.hasNext}
      />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps="handled">
            <QuestionContent
              questionGroup={currentGroup}
              currentQuestionNumber={questionInfo.orderIndex}
            />
            <AnswerOptions
              questionGroup={currentGroup}
              selectedAnswers={selectedAnswers}
              onSelectAnswer={handleSelectAnswer}
            />
          </ScrollView>
          
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
