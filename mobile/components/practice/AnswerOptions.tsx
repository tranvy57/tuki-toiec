import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '~/constants/Color';
import { QuestionGroup } from '~/constants/data_questions';

interface AnswerOptionsProps {
  questionGroup: QuestionGroup;
  selectedAnswers: Record<string, string>;
  onSelectAnswer: (questionId: string, answer: string) => void;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  questionGroup,
  selectedAnswers,
  onSelectAnswer,
}) => {
  if (!questionGroup) return null;

  return (
    <View className="px-4 pb-4">
      <View className="mb-6 rounded-lg p-3" style={{ backgroundColor: colors.warning }}>
        <Text className="text-center font-medium" style={{ color: colors.background }}>
          Select the answer
        </Text>
      </View>

      <View className="flex-col justify-start">
        {['A', 'B', 'C', 'D'].map((letter) => {
          const isSelected = selectedAnswers[questionGroup.questions[0]] === letter;

          return (
            <TouchableOpacity
              key={letter}
              onPress={() => onSelectAnswer(questionGroup.questions[0], letter)}
              className="mb-3 flex-row items-center rounded-lg border-2 p-4"
              style={{
                backgroundColor: isSelected ? colors.primary + '20' : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              }}>
              <View
                className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                  borderColor: isSelected ? colors.primary : colors.mutedForeground,
                }}>
                <Text
                  className="font-semibold"
                  style={{
                    color: isSelected ? colors.background : colors.mutedForeground,
                  }}>
                  {letter}
                </Text>
              </View>

              <View className="flex-1">
                <Text
                  className="text-base"
                  style={{
                    color: isSelected ? colors.primary : colors.foreground,
                    fontWeight: isSelected ? '600' : '400',
                  }}>
                  {letter === 'A'}
                  {letter === 'B'}
                  {letter === 'C'}
                  {letter === 'D'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
