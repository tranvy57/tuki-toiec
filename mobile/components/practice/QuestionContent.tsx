import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/constants/Color';
import { AudioPlayer } from './AudioPlayer';
import { QuestionImage } from './QuestionImage';
import { QuestionGroup } from '~/constants/data_questions';

interface QuestionContentProps {
  questionGroup: QuestionGroup;
  currentQuestionNumber: number;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({
  questionGroup,
  currentQuestionNumber,
}) => {
  return (
    <View className="px-4">
      <View className="mb-4">
        <Text className="mb-2 text-lg font-semibold" style={{ color: colors.foreground }}>
          Question {currentQuestionNumber}
        </Text>

        {questionGroup.audio_url && (
          <View className="mb-4">
            <AudioPlayer audioUrl={questionGroup.audio_url} />
          </View>
        )}

        {questionGroup.image_url && (
          <View className="mb-4">
            <QuestionImage
              uri={
                Array.isArray(questionGroup.image_url)
                  ? questionGroup.image_url[0]
                  : questionGroup.image_url
              }
            />
          </View>
        )}

        {questionGroup.paragraph && (
          <View className="mb-4 rounded-lg p-4" style={{ backgroundColor: colors.muted }}>
            <Text className="text-base leading-6" style={{ color: colors.foreground }}>
              {questionGroup.paragraph}
            </Text>
          </View>
        )}
{/* 
        {questionGroup.transcript && (
          <View className="mb-4">
            <Text className="text-base font-medium" style={{ color: colors.foreground }}>
              {questionGroup.transcript}
            </Text>
          </View>
        )} */}
      </View>
    </View>
  );
};
