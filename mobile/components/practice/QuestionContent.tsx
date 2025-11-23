import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/constants/Color';
import { AudioPlayer } from './AudioPlayer';
import { QuestionImage } from './QuestionImage';
import { Group, Question } from '~/types/response/TestResponse';

interface QuestionContentProps {
  questionGroup?: Group | null;
  currentQuestionNumber: number;
}

export const QuestionContent = memo<QuestionContentProps>(
  ({ questionGroup, currentQuestionNumber }) => {
    return (
      <View className="px-4">
        <View className="mb-4">
          <Text className="mb-2 text-lg font-semibold" style={{ color: colors.foreground }}>
            Question {currentQuestionNumber}
          </Text>

          {questionGroup?.audioUrl && (
            <View className="mb-4">
              <AudioPlayer audioUrl={questionGroup?.audioUrl} />
            </View>
          )}

          {questionGroup?.imageUrl && (
            <View className="mb-4">
              <QuestionImage
                uri={
                  Array.isArray(questionGroup.imageUrl)
                    ? questionGroup.imageUrl[0]
                    : questionGroup.imageUrl
                }
              />
            </View>
          )}

          {/* {questionGroup?.paragraphEn && (
            <View className="mb-4 rounded-lg p-4" style={{ backgroundColor: colors.muted }}>
              <Text className="text-base leading-6" style={{ color: colors.foreground }}>
                {questionGroup.paragraphEn}
              </Text>
            </View>
          )} */}
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
  }
);
