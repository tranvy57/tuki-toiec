import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colors } from '~/constants/Color';
import { QuestionResult } from '~/api/attempts/useTestResult';

interface QuestionDetailModalProps {
  visible: boolean;
  question: QuestionResult | null;
  onClose: () => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  visible,
  question,
  onClose,
}) => {
  const { width: contentWidth } = useWindowDimensions();

  if (!question) return null;

  const statusColor =
    question.isCorrect === true
      ? colors.success
      : question.isCorrect === false
        ? colors.destructive
        : colors.warning;

  const statusText =
    question.isCorrect === true ? 'Correct' : question.isCorrect === false ? 'Wrong' : 'Skipped';

  // Custom HTML styles for better rendering
  const tagsStyles = {
    body: {
      color: colors.foreground,
    },
    p: {
      marginVertical: 4,
    },
    strong: {
      fontWeight: 'bold' as const,
    },
    b: {
      fontWeight: 'bold' as const,
    },
    em: {
      fontStyle: 'italic' as const,
    },
    i: {
      fontStyle: 'italic' as const,
    },
    u: {
      textDecorationLine: 'underline' as const,
    },
    br: {
      height: 8,
    },
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-4"
          style={{
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <View className="flex-row items-center">
            <View
              className="mr-3 h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: statusColor }}>
              <Text className="text-sm font-bold text-white">{question.numberLabel}</Text>
            </View>
            <View>
              <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
                Question {question.numberLabel}
              </Text>
              <View
                className="mt-1 rounded px-2 py-0.5"
                style={{ backgroundColor: statusColor + '20', alignSelf: 'flex-start' }}>
                <Text className="text-xs font-semibold" style={{ color: statusColor }}>
                  {statusText}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={onClose} className="p-2">
            <AntDesign name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Group Context - Image */}
            {question.groupContext?.imageUrl && (
              <View className="mb-4">
                <Image
                  source={{ uri: question.groupContext.imageUrl }}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 12,
                    backgroundColor: colors.muted,
                  }}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Group Context - Paragraph */}
            {(question.groupContext?.paragraphEn || question.groupContext?.paragraphVn) && (
              <View
                className="mb-4 rounded-xl p-4"
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <View className="mb-2 flex-row items-center">
                  <Feather name="file-text" size={16} color={colors.primary} />
                  <Text className="ml-2 text-sm font-semibold" style={{ color: colors.primary }}>
                    Reading Passage
                  </Text>
                </View>

                {question.groupContext.paragraphEn && (
                  <View className="mb-2">
                    <Text
                      className="mb-1 text-xs font-semibold"
                      style={{ color: colors.mutedForeground }}>
                      English:
                    </Text>
                    <RenderHTML
                      contentWidth={contentWidth - 64}
                      source={{ html: question.groupContext.paragraphEn }}
                      baseStyle={{
                        color: colors.foreground,
                        fontSize: 14,
                        lineHeight: 22,
                      }}
                      tagsStyles={tagsStyles}
                    />
                  </View>
                )}

                {question.groupContext.paragraphVn && (
                  <View>
                    <Text
                      className="mb-1 text-xs font-semibold"
                      style={{ color: colors.mutedForeground }}>
                      Vietnamese:
                    </Text>
                    <RenderHTML
                      contentWidth={contentWidth - 64}
                      source={{ html: question.groupContext.paragraphVn }}
                      baseStyle={{
                        color: colors.mutedForeground,
                        fontSize: 14,
                        lineHeight: 22,
                      }}
                      tagsStyles={tagsStyles}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Audio Context */}
            {question.groupContext?.audioUrl && (
              <View
                className="mb-4 rounded-xl p-4"
                style={{
                  backgroundColor: colors.primary + '10',
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}>
                <View className="flex-row items-center">
                  <Feather name="headphones" size={20} color={colors.primary} />
                  <Text className="ml-2 font-semibold" style={{ color: colors.primary }}>
                    Audio Available
                  </Text>
                </View>
                <Text className="mt-1 text-xs" style={{ color: colors.mutedForeground }}>
                  This question includes audio content
                </Text>
              </View>
            )}

            {/* Question Content */}
            {question.content && (
              <View
                className="mb-4 rounded-xl p-4"
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <Text
                  className="mb-2 text-xs font-semibold"
                  style={{ color: colors.mutedForeground }}>
                  Question:
                </Text>
                <RenderHTML
                  contentWidth={contentWidth - 64}
                  source={{ html: question.content }}
                  baseStyle={{
                    color: colors.foreground,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                  tagsStyles={tagsStyles}
                />
              </View>
            )}

            {/* Answers */}
            <View className="mb-4">
              <Text className="mb-3 text-sm font-semibold" style={{ color: colors.foreground }}>
                Answer Choices:
              </Text>

              {question.answers.map(
                (answer: {
                  id: string;
                  answerKey: string;
                  content: string;
                  isCorrect: boolean;
                }) => {
                  const isUserAnswer = answer.answerKey === question.selectedAnswer;
                  const isCorrectAnswer = answer.answerKey === question.correctAnswer;
                  let bgColor: string = colors.card;
                  let borderColor: string = colors.border;

                  if (isCorrectAnswer) {
                    bgColor = colors.success + '15';
                    borderColor = colors.success;
                  }
                  if (isUserAnswer && !isCorrectAnswer) {
                    bgColor = colors.destructive + '15';
                    borderColor = colors.destructive;
                  }

                  return (
                    <View
                      key={answer.id}
                      className="mb-3 rounded-xl p-4"
                      style={{
                        backgroundColor: bgColor,
                        borderWidth: 2,
                        borderColor,
                      }}>
                      <View className="flex-row items-start">
                        <View
                          className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: isCorrectAnswer
                              ? colors.success
                              : isUserAnswer
                                ? colors.destructive
                                : colors.muted,
                          }}>
                          <Text
                            className="font-bold"
                            style={{
                              color: isCorrectAnswer || isUserAnswer ? 'white' : colors.foreground,
                            }}>
                            {answer.answerKey}
                          </Text>
                        </View>

                        <View className="flex-1">
                          <RenderHTML
                            contentWidth={contentWidth - 140}
                            source={{ html: answer.content }}
                            baseStyle={{
                              color: colors.foreground,
                              fontSize: 16,
                              lineHeight: 24,
                            }}
                            tagsStyles={tagsStyles}
                          />

                          {/* Status badges */}
                          <View className="mt-2 flex-row items-center">
                            {isCorrectAnswer && (
                              <View className="mr-2 flex-row items-center rounded-full bg-green-100 px-2 py-1">
                                <AntDesign name="checkcircle" size={12} color={colors.success} />
                                <Text
                                  className="ml-1 text-xs font-semibold"
                                  style={{ color: colors.success }}>
                                  Correct Answer
                                </Text>
                              </View>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <View className="flex-row items-center rounded-full bg-red-100 px-2 py-1">
                                <AntDesign
                                  name="closecircle"
                                  size={12}
                                  color={colors.destructive}
                                />
                                <Text
                                  className="ml-1 text-xs font-semibold"
                                  style={{ color: colors.destructive }}>
                                  Your Answer
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* Summary */}
            <View
              className="mb-4 rounded-xl p-4"
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
              <Text className="mb-3 font-semibold" style={{ color: colors.foreground }}>
                Summary
              </Text>

              <View className="mb-2 flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Your Answer:</Text>
                <Text
                  className="font-semibold"
                  style={{
                    color: question.selectedAnswer
                      ? question.isCorrect
                        ? colors.success
                        : colors.destructive
                      : colors.warning,
                  }}>
                  {question.selectedAnswer || 'Not answered'}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text style={{ color: colors.mutedForeground }}>Correct Answer:</Text>
                <Text className="font-semibold" style={{ color: colors.success }}>
                  {question.correctAnswer}
                </Text>
              </View>
            </View>

            {/* Explanation */}
            {question.explanation && (
              <View
                className="mb-6 rounded-xl p-4"
                style={{
                  backgroundColor: colors.primary + '10',
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}>
                <View className="mb-2 flex-row items-center">
                  <Feather name="info" size={18} color={colors.primary} />
                  <Text className="ml-2 font-semibold" style={{ color: colors.primary }}>
                    Explanation
                  </Text>
                </View>
                <RenderHTML
                  contentWidth={contentWidth - 64}
                  source={{ html: question.explanation }}
                  baseStyle={{
                    color: colors.foreground,
                    fontSize: 14,
                    lineHeight: 22,
                  }}
                  tagsStyles={tagsStyles}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          className="px-4 py-3"
          style={{
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}>
          <TouchableOpacity
            onPress={onClose}
            className="rounded-xl py-3"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
