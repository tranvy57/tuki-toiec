import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '~/constants/Color';
import { QuestionHeader } from './QuestionHeader';

interface LoadingScreenProps {
  currentQuestionNumber: number;
  isChangingQuestion: boolean;
  onGoBack: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  currentQuestionNumber,
  isChangingQuestion,
  onGoBack,
}) => {
  const renderHeader = () => (
    <QuestionHeader
      currentQuestionNumber={currentQuestionNumber}
      totalQuestions={100}
      onGoBack={onGoBack}
      onPrevious={() => {}}
      onNext={() => {}}
      hasPrevious={false}
      hasNext={false}
    />
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {renderHeader()}
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-lg" style={{ color: colors.mutedForeground }}>
          {isChangingQuestion
            ? `Loading question ${currentQuestionNumber}...`
            : 'Loading question...'}
        </Text>
      </View>
    </View>
  );
};
