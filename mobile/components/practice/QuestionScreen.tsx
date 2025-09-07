'use client';

import { useRouter } from 'expo-router';
import type React from 'react';
import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '~/constants/Color';

// New Components
import { useCurrentTest } from '~/hooks/useCurrentTest';
import { AnswerOptions } from './AnswerOptions';
import { GestureWrapper } from './GestureWrapper';
import { LoadingScreen } from './LoadingScreen';
import { QuestionContent } from './QuestionContent';
import { QuestionHeader } from './QuestionHeader';

const { width } = Dimensions.get('window');

export const QuestionScreen: React.FC = () => {
  const { currentGroup, nextGroup, beforeGroup, selectedAnswers, setAnswer } = useCurrentTest();

  const router = useRouter();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [isChangingQuestion, setIsChangingQuestion] = useState(false);

  const handleSubmit = () => {
    // const currentQuestion = questionGroup?.questions[0];
    // if (!currentQuestion || !selectedAnswers[currentQuestion]) {
    //   Alert.alert('Incomplete', 'Please select an answer before submitting.', [{ text: 'OK' }]);
    //   return;
    // }
    // Alert.alert('Submit Answer', 'Are you sure you want to submit your answer?', [
    //   { text: 'Cancel', style: 'cancel' },
    //   {
    //     text: 'Submit',
    //     onPress: () => {
    //       // Handle submission logic here
    //       console.log('Submitted answer:', selectedAnswers);
    //       router.back();
    //     },
    //   },
    // ]);
  };
  const goNext = () => {
    nextGroup();
  };

  const goPrev = () => {
    beforeGroup();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      runOnJS(setIsChangingQuestion)(true);
      if (event.translationX < -80) {
        // Swipe left -> next
        translateX.value = withSpring(-width, {}, (finished) => {
          if (finished) {
            runOnJS(goNext)();
            translateX.value = withSpring(0, {}, () => {
              runOnJS(setIsChangingQuestion)(false);
            });
          }
        });
      } else if (event.translationX > 80) {
        // Swipe right -> previous
        translateX.value = withSpring(width, {}, (finished) => {
          if (finished) {
            runOnJS(goPrev)();
            translateX.value = withSpring(0, {}, () => {
              runOnJS(setIsChangingQuestion)(false);
            });
          }
        });
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Helper function for answer selection
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setAnswer(questionId, answer);
    console.log('Checkkk', selectedAnswers);
  };

  // Loading state
  if (isChangingQuestion) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingScreen
          currentQuestionNumber={currentGroup?.orderIndex}
          isChangingQuestion={isChangingQuestion}
          onGoBack={() => router.back()}
        />
      </GestureHandlerRootView>
    );
  }

  // if(isPending) return <Text>Loading...</Text>;

  // Main render
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <QuestionHeader
          currentQuestionNumber={currentGroup?.questions[0]?.numberLabel}
          totalQuestions={200}
          onGoBack={() => router.back()}
          onPrevious={goPrev}
          onNext={goNext}
          hasPrevious={(currentGroup?.orderIndex ?? 0) > 1}
          hasNext={(currentGroup?.orderIndex ?? 0) < 200}
        />
        <GestureWrapper
          panGesture={panGesture}
          animatedStyle={animatedStyle}
          contentAnimatedStyle={contentAnimatedStyle}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }} // tránh che mất answer cuối
            showsVerticalScrollIndicator={false}>
            <QuestionContent
              questionGroup={currentGroup}
              currentQuestionNumber={currentGroup?.orderIndex || 0}
            />
            <AnswerOptions
              questionGroup={currentGroup}
              selectedAnswers={selectedAnswers}
              onSelectAnswer={handleSelectAnswer}
            />
          </ScrollView>
        </GestureWrapper>
      </View>
    </GestureHandlerRootView>
    //  <ScrollView>{isSuccess && <Text>{JSON.stringify(data, null, 2)}</Text>}</ScrollView>
  );
};
