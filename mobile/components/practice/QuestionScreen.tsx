'use client';

import { useRouter } from 'expo-router';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Text,
  View
} from 'react-native';
import { Gesture, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '~/constants/Color';
import { findQuestionGroup, QuestionGroup } from '~/constants/data_questions';

// New Components
import { AnswerOptions } from './AnswerOptions';
import { GestureWrapper } from './GestureWrapper';
import { LoadingScreen } from './LoadingScreen';
import { QuestionContent } from './QuestionContent';
import { QuestionHeader } from './QuestionHeader';
import { useStartTestPractice } from '~/api/attempts/useStartAttempt';
import { useCurrentTest } from '~/hooks/useCurrentTest';

const { width } = Dimensions.get('window');

export const QuestionScreen: React.FC = () => {
  const { currentGroup, nextGroup, beforeGroup } = useCurrentTest();

  const router = useRouter();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isChangingQuestion, setIsChangingQuestion] = useState(false);

  // useEffect(() => {
  //   const loadQuestion = async () => {
  //     // // Fade out animation
  //     opacity.value = withTiming(0, { duration: 150 });
  //     // Simulate loading time for better UX
  //     // await new Promise((resolve) => setTimeout(resolve, 200));
  //     // const group = findQuestionGroup(currentGroup);
  //     // setQuestionGroup(group);
  //     // Fade in animation
  //     opacity.value = withTiming(1, { duration: 200 });
  //     setIsChangingQuestion(false);
  //     // mutate('9d3258e6-0e03-4153-a99a-3bfb3daa8c67', {
  //     //   onSuccess: (res) => {
  //     //     console.log('Mutation success:', res, data);
  //     //   },
  //     //   onError: (err) => {
  //     //     console.error('Mutation failed:', err);
  //     //   },
  //     // });
  //   };
  //   loadQuestion();
  // }, [currentGroup]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

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
            translateX.value = 0;
            runOnJS(setIsChangingQuestion)(false);
          }
        });
      } else if (event.translationX > 80) {
        // Swipe right -> previous
        translateX.value = withSpring(width, {}, (finished) => {
          if (finished) {
            runOnJS(goPrev)();
            translateX.value = 0;
            runOnJS(setIsChangingQuestion)(false);
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
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
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
