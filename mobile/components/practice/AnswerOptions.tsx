import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Group } from '~/api/attempts/useStartAttempt';
import { colors } from '~/constants/Color';
import { QuestionGroup } from '~/constants/data_questions';

interface AnswerOptionsProps {
  questionGroup: Group | null;
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
        {questionGroup.questions.map((question) => (
          <View key={question.id} className="mb-6">
            {/* Hiển thị số thứ tự và nội dung câu hỏi */}
            <Text className="mb-2 text-lg font-semibold text-foreground">
              {question.numberLabel}. {question.content}
            </Text>

            {/* Render 4 đáp án cho câu này */}
            {question.answers
              .slice()
              .sort((a, b) => a.answerKey.localeCompare(b.answerKey))
              .map((answer) => {
                const isSelected = selectedAnswers[question.id] === answer.answerKey;

                return (
                  <TouchableOpacity
                    key={answer.id}
                    onPress={() => onSelectAnswer(question.id, answer.answerKey)}
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
                        {answer.answerKey}
                      </Text>
                    </View>

                    {/* Nội dung đáp án */}
                    <View className="flex-1">
                      <Text
                        className="text-base"
                        style={{
                          color: isSelected ? colors.primary : colors.foreground,
                          fontWeight: isSelected ? '600' : '400',
                        }}>
                        {answer.content}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        ))}
      </View>
    </View>
  );
};
