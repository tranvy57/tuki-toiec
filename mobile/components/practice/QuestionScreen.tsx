'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { findQuestionGroup, QuestionGroup } from '~/constants/data_questions';
import { AudioPlayer } from './AudioPlayer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '~/constants/Color';
import { AntDesign } from '@expo/vector-icons';


export const QuestionScreen: React.FC = () => {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>(); // id = test_id, q = số câu

  const [questionGroup, setQuestionGroup] = useState<QuestionGroup | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  
  const currentQuestionNumber = parseInt(q) || 1;

  useEffect(() => {
    const group = findQuestionGroup(parseInt(q) || 1);
    console.log(group)
    setQuestionGroup(group);

    // if (!group) {
    //   Alert.alert('Error', 'Question not found', [
    //     { text: 'OK', onPress: () => router.back() },
    //   ]);
    // }
  }, [q]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const currentQuestion = questionGroup?.questions[0];
    
    if (!currentQuestion || !selectedAnswers[currentQuestion]) {
      Alert.alert('Incomplete', 'Please select an answer before submitting.', [
        { text: 'OK' },
      ]);
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

  const renderHeader = () => {
    return (
      <View 
        className="flex-row items-center justify-between px-4 py-3"
        style={{ 
          backgroundColor: colors.primary,
        }}>
        {/* Left side - Back button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2">
          <AntDesign name="arrowleft" size={24} color={colors.primaryForeground} />
        </TouchableOpacity>

        {/* Center - Question counter */}
        <View className="flex-1 items-center">
          <Text 
            className="text-lg font-medium"
            style={{ color: colors.primaryForeground }}>
            Câu {currentQuestionNumber}/200
          </Text>
        </View>

        {/* Right side - Nộp bài button */}
        <TouchableOpacity 
          onPress={handleSubmit}
          className="rounded-lg px-3 py-1"
          style={{ backgroundColor: colors.primaryForeground }}>
          <Text 
            className="text-sm font-medium"
            style={{ color: colors.primary }}>
            Nộp bài
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuestionContent = () => {
    if (!questionGroup) return null;

    const { part_id, image_url, audio_url, paragraph } = questionGroup;

    return (
      <View className="px-4 pt-4">
        {/* Audio Player */}
        {audio_url && (
          <View className="mb-4">
            <AudioPlayer audioUrl={audio_url} />
          </View>
        )}

        {/* Question Number */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-medium" style={{ color: colors.foreground }}>
            {questionGroup.questions[0] || '1'}.
          </Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Part {part_id}
          </Text>
        </View>

        {/* Image */}
        {image_url && image_url?.length > 0 && (
          <View className="mb-6">
            <Image
              source={{ uri: Array.isArray(image_url) ? image_url[0] : image_url }}
              className="w-full rounded-lg"
              style={{ height: 240, backgroundColor: colors.warmGray100 }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Paragraph / Reading passage */}
        {paragraph && (
          <View
            className="mb-6 rounded-lg p-4"
            style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
            <Text className="text-base leading-6" style={{ color: colors.foreground }}>
              {paragraph}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderAnswerOptions = () => {
    if (!questionGroup) return null;

    // Simple A, B, C, D options

    return (
      <View className="px-4 pb-4">
        {/* Select the answer banner */}
        <View 
          className="mb-6 rounded-lg p-3"
          style={{ backgroundColor: colors.warning }}>
          <Text 
            className="text-center font-medium"
            style={{ color: colors.background }}>
            Select the answer
          </Text>
        </View>

        {/* Simple answer options like in reference */}
        <View className="flex-col  justify-start">
          {['A', 'B', 'C', 'D'].map((letter) => {
            const isSelected = selectedAnswers[questionGroup.questions[0]] === letter;
            
            return (
              <TouchableOpacity
                key={letter}
                onPress={() => handleAnswerSelect(questionGroup.questions[0], letter)}
                className="mr-4 mb-4"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.brandCoral : colors.warmGray300,
                  backgroundColor: isSelected ? colors.brandCoral : colors.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  className="text-lg font-medium"
                  style={{
                    color: isSelected ? colors.primaryForeground : colors.foreground,
                  }}>
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  if (!questionGroup) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {renderHeader()}
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg" style={{ color: colors.mutedForeground }}>Loading question...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {renderHeader()}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {renderQuestionContent()}
        {renderAnswerOptions()}
      </ScrollView>
    </View>
  );
};