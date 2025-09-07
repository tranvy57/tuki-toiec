import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colors } from '~/constants/Color';
import { useTestResult, TestResult } from '~/api/attempts/useTestResult';

// Mock data for demonstration
const mockTestResult: TestResult = {
  attemptId: 'attempt-123',
  testTitle: 'TOEIC Practice Test 1',
  mode: 'practice',
  startedAt: '2025-09-06T06:00:00.000Z',
  finishedAt: '2025-09-06T08:00:00.000Z',
  totalScore: 850,
  listeningScore: 425,
  readingScore: 425,
  totalQuestions: 200,
  totalCorrect: 170,
  totalIncorrect: 25,
  totalSkipped: 5,
  accuracy: 85,
  duration: '2h 0m',
  status: 'submitted',
  parts: [
    {
      partNumber: 1,
      totalQuestions: 6,
      correctAnswers: 5,
      incorrectAnswers: 1,
      skippedQuestions: 0,
      accuracy: 83.3,
      questions: [],
    },
    {
      partNumber: 2,
      totalQuestions: 25,
      correctAnswers: 22,
      incorrectAnswers: 2,
      skippedQuestions: 1,
      accuracy: 88,
      questions: [],
    },
    {
      partNumber: 3,
      totalQuestions: 39,
      correctAnswers: 35,
      incorrectAnswers: 3,
      skippedQuestions: 1,
      accuracy: 89.7,
      questions: [],
    },
    {
      partNumber: 4,
      totalQuestions: 30,
      correctAnswers: 26,
      incorrectAnswers: 4,
      skippedQuestions: 0,
      accuracy: 86.7,
      questions: [],
    },
    {
      partNumber: 5,
      totalQuestions: 30,
      correctAnswers: 25,
      incorrectAnswers: 4,
      skippedQuestions: 1,
      accuracy: 83.3,
      questions: [],
    },
    {
      partNumber: 6,
      totalQuestions: 16,
      correctAnswers: 14,
      incorrectAnswers: 2,
      skippedQuestions: 0,
      accuracy: 87.5,
      questions: [],
    },
    {
      partNumber: 7,
      totalQuestions: 54,
      correctAnswers: 43,
      incorrectAnswers: 9,
      skippedQuestions: 2,
      accuracy: 79.6,
      questions: [],
    },
  ],
};

export default function TestResultPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const attemptId = params.id as string;

  // Sử dụng fake data thay vì API call
  const result = mockTestResult;
  const isLoading = false;
  const error = null;
  
  // const { data: result, isLoading, error } = useTestResult(attemptId);
  const [expandedParts, setExpandedParts] = useState<number[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const togglePartExpansion = (partNumber: number) => {
    setExpandedParts((prev) =>
      prev.includes(partNumber) ? prev.filter((p) => p !== partNumber) : [...prev, partNumber]
    );
  };

  const getPartTitle = (partNumber: number) => {
    const titles = {
      1: 'Photographs',
      2: 'Question-Response',
      3: 'Conversations',
      4: 'Short Talks',
      5: 'Incomplete Sentences',
      6: 'Text Completion',
      7: 'Reading Comprehension',
    };
    return titles[partNumber as keyof typeof titles] || `Part ${partNumber}`;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return colors.mutedForeground;
    if (score >= 900) return colors.success;
    if (score >= 700) return colors.warning;
    return colors.destructive;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return colors.success;
    if (accuracy >= 70) return colors.warning;
    return colors.destructive;
  };

  const handleGoHome = () => {
    router.push('/(tabs)/(tests)');
  };

  const handleReviewTest = () => {
    router.push({
      pathname: '/(tabs)/(tests)/[id]/review',
      params: { id: attemptId },
    });
  };

  useEffect(() => {
    // Animation entrance
    if (result) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [result]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-lg" style={{ color: colors.foreground }}>
            Loading results...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center px-4">
          <AntDesign name="exclamationcircleo" size={48} color={colors.destructive} />
          <Text
            className="mt-4 text-center text-lg font-semibold"
            style={{ color: colors.foreground }}>
            Unable to load results
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.mutedForeground }}>
            Please try again later
          </Text>
          <TouchableOpacity
            onPress={handleGoHome}
            className="mt-6 rounded-xl px-6 py-3"
            style={{ backgroundColor: colors.primary }}>
            <Text className="font-semibold text-white">Back to Tests</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}>
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleGoHome}
              className="-ml-2 p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-white">Test Results</Text>

            <TouchableOpacity onPress={handleReviewTest} className="-mr-2 p-2">
              <Feather name="eye" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Score Summary */}
          <View className="items-center">
            <Text className="mb-2 text-3xl font-bold text-white">{result.totalScore || 'N/A'}</Text>
            <Text className="mb-4 text-white opacity-90">Total Score</Text>

            <View className="flex-row space-x-8">
              <View className="items-center">
                <Text className="text-xl font-bold text-white">
                  {result.listeningScore || 'N/A'}
                </Text>
                <Text className="text-sm text-white opacity-80">Listening</Text>
              </View>

              <View className="items-center">
                <Text className="text-xl font-bold text-white">{result.readingScore || 'N/A'}</Text>
                <Text className="text-sm text-white opacity-80">Reading</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Overall Stats Card */}
          <View className="mx-4 mb-4 mt-6">
            <View
              className="rounded-2xl p-6"
              style={{
                backgroundColor: colors.card,
                shadowColor: colors.foreground,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
              <Text className="mb-4 text-lg font-semibold" style={{ color: colors.foreground }}>
                Overview
              </Text>

              <View className="mb-3 flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Duration:</Text>
                <Text className="font-medium" style={{ color: colors.foreground }}>
                  {result.duration}
                </Text>
              </View>

              <View className="mb-3 flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Accuracy:</Text>
                <Text className="font-medium" style={{ color: getAccuracyColor(result.accuracy) }}>
                  {result.accuracy}%
                </Text>
              </View>

              <View className="mb-3 flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Correct:</Text>
                <Text className="font-medium" style={{ color: colors.success }}>
                  {result.totalCorrect}/{result.totalQuestions}
                </Text>
              </View>

              <View className="mb-3 flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Incorrect:</Text>
                <Text className="font-medium" style={{ color: colors.destructive }}>
                  {result.totalIncorrect}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Skipped:</Text>
                <Text className="font-medium" style={{ color: colors.warning }}>
                  {result.totalSkipped}
                </Text>
              </View>
            </View>
          </View>

          {/* Parts Results */}
          <View className="mx-4 mb-6">
            <Text className="mb-4 text-lg font-semibold" style={{ color: colors.foreground }}>
              Results by Part
            </Text>

            {result.parts.map((part, index) => (
              <View key={part.partNumber} className="mb-3">
                <TouchableOpacity
                  onPress={() => togglePartExpansion(part.partNumber)}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  activeOpacity={0.8}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="mb-2 flex-row items-center">
                        <View
                          className="mr-3 rounded-full px-2 py-1"
                          style={{ backgroundColor: colors.primary + '20' }}>
                          <Text className="text-xs font-bold" style={{ color: colors.primary }}>
                            Part {part.partNumber}
                          </Text>
                        </View>

                        <Text
                          className="flex-1 text-sm font-medium"
                          style={{ color: colors.foreground }}>
                          {getPartTitle(part.partNumber)}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                          {part.correctAnswers}/{part.totalQuestions} correct
                        </Text>

                        <Text
                          className="text-sm font-medium"
                          style={{ color: getAccuracyColor(part.accuracy) }}>
                          {part.accuracy.toFixed(1)}%
                        </Text>
                      </View>

                      {/* Progress Bar */}
                      <View
                        className="mt-2 h-2 overflow-hidden rounded-full"
                        style={{ backgroundColor: colors.muted }}>
                        <View
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: getAccuracyColor(part.accuracy),
                            width: `${part.accuracy}%`,
                          }}
                        />
                      </View>
                    </View>

                    <AntDesign
                      name={expandedParts.includes(part.partNumber) ? 'up' : 'down'}
                      size={16}
                      color={colors.mutedForeground}
                      style={{ marginLeft: 12 }}
                    />
                  </View>

                  {/* Expanded Details */}
                  {expandedParts.includes(part.partNumber) && (
                    <View
                      className="mt-4 pt-4"
                      style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                      <View className="mb-2 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: colors.success }}
                          />
                          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                            Correct: {part.correctAnswers}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <View
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: colors.destructive }}
                          />
                          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                            Wrong: {part.incorrectAnswers}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <View
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: colors.warning }}
                          />
                          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                            Skipped: {part.skippedQuestions}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Actions */}
        <View
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleReviewTest}
              className="flex-1 rounded-xl py-4"
              style={{
                backgroundColor: colors.secondary,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold" style={{ color: colors.foreground }}>
                Review Answers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoHome}
              className="flex-1 rounded-xl py-4"
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}>
              <Text className="text-center font-semibold text-white">Back to Tests</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
