import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '~/constants/Color';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ReviewPartCardProps {
  partNumber: number;
  testId: string;
  title?: string;
  questionsCount?: number;
  directions?: string;
  isCompleted?: boolean;
}

export const ReviewPartCard: React.FC<ReviewPartCardProps> = ({
  partNumber,
  testId,
  title,
  questionsCount,
  directions,
  isCompleted = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/(tests)/[id]/review-part`,
      params: { id: testId, part: partNumber.toString() },
    });
  };

  const getPartTitle = (partNum: number) => {
    const titles = {
      1: 'Photographs',
      2: 'Question-Response',
      3: 'Conversations',
      4: 'Short Talks',
      5: 'Incomplete Sentences',
      6: 'Text Completion',
      7: 'Reading Comprehension',
    };
    return titles[partNum as keyof typeof titles] || `Part ${partNum}`;
  };

  return (
    <TouchableOpacity onPress={handlePress} className="mx-4 mb-4" activeOpacity={0.7}>
      <View
        className="rounded-xl p-4"
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.foreground,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            {/* Part Number and Title */}
            <View className="mb-2 flex-row items-center">
              <View
                className="mr-3 rounded-full px-3 py-1"
                style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                  Part {partNumber}
                </Text>
              </View>

              {isCompleted && (
                <View
                  className="rounded-full px-2 py-1"
                  style={{ backgroundColor: colors.success + '20' }}>
                  <AntDesign name="check" size={12} color={colors.success} />
                </View>
              )}
            </View>

            {/* Title */}
            <Text className="mb-1 text-lg font-semibold" style={{ color: colors.foreground }}>
              {title || getPartTitle(partNumber)}
            </Text>

            {/* Question Count */}
            {questionsCount && (
              <Text className="mb-2 text-sm" style={{ color: colors.mutedForeground }}>
                {questionsCount} questions
              </Text>
            )}

            {/* Directions Preview */}
            {directions && (
              <Text className="text-sm" style={{ color: colors.mutedForeground }} numberOfLines={2}>
                {directions}
              </Text>
            )}
          </View>

          {/* Arrow Icon */}
          <View className="ml-4">
            <AntDesign name="right" size={16} color={colors.mutedForeground} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
