'use client';

import { useRouter } from 'expo-router';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  View
} from 'react-native';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
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

const { width } = Dimensions.get('window');

export const QuestionScreen: React.FC = () => {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [questionGroup, setQuestionGroup] = useState<QuestionGroup | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [isChangingQuestion, setIsChangingQuestion] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      // Fade out animation
      opacity.value = withTiming(0, { duration: 150 });
      // Simulate loading time for better UX
      // await new Promise((resolve) => setTimeout(resolve, 200));
      const group = findQuestionGroup(currentQuestionNumber);
      setQuestionGroup(group);
      // Preload next question image
      const nextGroup = findQuestionGroup(currentQuestionNumber + 1);
      if (nextGroup?.image_url) {
        const url = Array.isArray(nextGroup.image_url)
          ? nextGroup.image_url[0]
          : nextGroup.image_url;
        if (url) {
          Image.prefetch(url);
        }
      }
      // Fade in animation
      opacity.value = withTiming(1, { duration: 200 });
      setIsChangingQuestion(false);
    };
    loadQuestion();
  }, [currentQuestionNumber]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const currentQuestion = questionGroup?.questions[0];

    if (!currentQuestion || !selectedAnswers[currentQuestion]) {
      Alert.alert('Incomplete', 'Please select an answer before submitting.', [{ text: 'OK' }]);
      return;
    }

    Alert.alert('Submit Answer', 'Are you sure you want to submit your answer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () => {
          // Handle submission logic here
          console.log('Submitted answer:', selectedAnswers);
          router.back();
        },
      },
    ]);
  };
  const goNext = () => {
    const next = currentQuestionNumber + 1;
    const nextGroup = findQuestionGroup(next);

    if (nextGroup) {
      setCurrentQuestionNumber(next);
    } else {
      Alert.alert('Submit Test', 'You have reached the last question. Submit now?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            console.log('Submitted answers:', selectedAnswers);
            // TODO: Navigate to results
          },
        },
      ]);
    }
  };

  const goPrev = () => {
    if (currentQuestionNumber > 1) {
      setCurrentQuestionNumber((prev) => prev - 1);
    }
  };

  const panGesture = Gesture.Pan()
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
          }
        });
      } else if (event.translationX > 80) {
        // Swipe right -> previous
        translateX.value = withSpring(width, {}, (finished) => {
          if (finished) {
            runOnJS(goPrev)();
            translateX.value = 0;
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
  if (!questionGroup || isChangingQuestion) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingScreen
          currentQuestionNumber={currentQuestionNumber}
          isChangingQuestion={isChangingQuestion}
          onGoBack={() => router.back()}
        />
      </GestureHandlerRootView>
    );
  }

  // Main render
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <QuestionHeader
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={200}
          onGoBack={() => router.back()}
          onPrevious={goPrev}
          onNext={goNext}
          hasPrevious={currentQuestionNumber > 1}
          hasNext={currentQuestionNumber < 200}
        />
        <GestureWrapper
          panGesture={panGesture}
          animatedStyle={animatedStyle}
          contentAnimatedStyle={contentAnimatedStyle}>
          <QuestionContent
            questionGroup={questionGroup}
            currentQuestionNumber={currentQuestionNumber}
          />
          <AnswerOptions
            questionGroup={questionGroup}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
          />
        </GestureWrapper>
      </View>
    </GestureHandlerRootView>
  );
};
