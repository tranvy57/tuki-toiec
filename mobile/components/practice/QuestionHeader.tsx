import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '~/constants/Color';

interface QuestionHeaderProps {
  currentQuestionNumber?: number;
  totalQuestions: number;
  onGoBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  currentQuestionNumber,
  totalQuestions,
  onGoBack,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={{ backgroundColor: colors.primary }}>
      
      {/* Left side - Back button */}
      <TouchableOpacity onPress={() => router.back()} className="p-2">
        
        <AntDesign name="arrowleft" size={24} color={colors.primaryForeground} />
      </TouchableOpacity>
      {/* Center - Question counter */}
      <View className="flex-1 items-center">
        
        <View className="flex-row items-center">
          
          <Text className="text-lg font-medium" style={{ color: colors.primaryForeground }}>
            
            Câu {currentQuestionNumber}
          </Text>
        </View>
      </View>
      {/* Right side - Nộp bài button */}
      <TouchableOpacity
        className="rounded-lg px-3 py-1"
        style={{ backgroundColor: colors.primaryForeground }}>
        
        <Text className="text-sm font-medium" style={{ color: colors.primary }}>
          
          Nộp bài
        </Text>
      </TouchableOpacity>
    </View>
  );
};
