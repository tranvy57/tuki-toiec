import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ReviewVocabulary } from '~/api/vocabularies/useVocabularyReview';
import { WeakVocabulary, QuizType } from '~/types/vocabulary';
import { colors } from '~/constants/Color';
import { Audio } from 'expo-av';

interface QuizSessionProps {
  currentWord: ReviewVocabulary;
  currentQuizType: QuizType;
  allVocabularies: WeakVocabulary[];
  quizOptions: { key: string; value: string }[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  quizAnswer: string;
  onAnswerChange: (answer: string) => void;
  isCompleted: boolean;
  onSubmit: () => void;
  onSkip: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  currentWord,
  currentQuizType,
  quizOptions,
  selectedOption,
  onSelectOption,
  quizAnswer,
  onAnswerChange,
  isCompleted,
  onSubmit,
  onSkip,
}) => {
  const isCorrect =
    currentQuizType === 'mcq'
      ? selectedOption === currentWord.content.correctKey
      : quizAnswer.toLowerCase().trim() === currentWord.content.answer?.toLowerCase().trim();

  const handlePlayAudio = async () => {
    if (!currentWord.content.audioUrl) return;

    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: currentWord.content.audioUrl,
      });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderQuizContent = () => {
    switch (currentQuizType) {
      case 'mcq':
        return (
          <View style={styles.quizContent}>
            <Text style={styles.question}>{currentWord.content.question}</Text>

            <View style={styles.options}>
              {quizOptions.map((option) => {
                const isSelected = selectedOption === option.key;
                const isCorrectOption =
                  isCompleted && option.key === currentWord.content.correctKey;
                const isWrongOption = isCompleted && isSelected && !isCorrect;

                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                      isCorrectOption && styles.optionCorrect,
                      isWrongOption && styles.optionWrong,
                    ]}
                    onPress={() => !isCompleted && onSelectOption(option.key)}
                    disabled={isCompleted}>
                    <Text
                      style={[
                        styles.optionKey,
                        (isCorrectOption || isWrongOption) && styles.optionKeyHighlight,
                      ]}>
                      {option.key}
                    </Text>
                    <Text
                      style={[
                        styles.optionValue,
                        (isCorrectOption || isWrongOption) && styles.optionValueHighlight,
                      ]}>
                      {option.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'cloze':
        return (
          <View style={styles.quizContent}>
            <Text style={styles.question}>{currentWord.content.question}</Text>

            <TextInput
              style={[
                styles.input,
                isCompleted && (isCorrect ? styles.inputCorrect : styles.inputWrong),
              ]}
              value={quizAnswer}
              onChangeText={onAnswerChange}
              placeholder="Nhập câu trả lời..."
              placeholderTextColor={colors.mutedForeground}
              editable={!isCompleted}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {isCompleted && (
              <View style={styles.answerReveal}>
                <Text style={styles.correctAnswerLabel}>Đáp án đúng:</Text>
                <Text style={styles.correctAnswerText}>{currentWord.content.answer}</Text>
              </View>
            )}
          </View>
        );

      case 'pronunciation':
        return (
          <View style={styles.quizContent}>
            <Text style={styles.question}>Nghe và viết từ bạn nghe được:</Text>

            {currentWord.content.audioUrl && (
              <TouchableOpacity style={styles.audioPlayButton} onPress={handlePlayAudio}>
                <Feather name="volume-2" size={32} color="#fff" />
                <Text style={styles.audioPlayText}>Phát âm thanh</Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={[
                styles.input,
                isCompleted && (isCorrect ? styles.inputCorrect : styles.inputWrong),
              ]}
              value={quizAnswer}
              onChangeText={onAnswerChange}
              placeholder="Nhập từ bạn nghe được..."
              placeholderTextColor={colors.mutedForeground}
              editable={!isCompleted}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {isCompleted && (
              <View style={styles.answerReveal}>
                <Text style={styles.correctAnswerLabel}>Từ đúng:</Text>
                <Text style={styles.correctAnswerText}>
                  {currentWord.content.word} - {currentWord.content.meaning}
                </Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const canSubmit = currentQuizType === 'mcq' ? selectedOption !== '' : quizAnswer.trim() !== '';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {renderQuizContent()}

        {/* Result indicator */}
        {isCompleted && (
          <View style={[styles.result, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            {isCorrect ? (
              <>
                <Feather name="check-circle" size={24} color="#22c55e" />
                <Text style={styles.resultText}>Chính xác! 🎉</Text>
              </>
            ) : (
              <>
                <Feather name="x-circle" size={24} color="#ef4444" />
                <Text style={styles.resultText}>Chưa đúng, hãy xem lại! 🤔</Text>
              </>
            )}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          {!isCompleted ? (
            <>
              <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={onSkip}>
                <Feather name="skip-forward" size={20} color={colors.foreground} />
                <Text style={styles.skipButtonText}>Bỏ qua</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton, !canSubmit && styles.buttonDisabled]}
                onPress={onSubmit}
                disabled={!canSubmit}>
                <Text style={styles.submitButtonText}>Trả lời</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={onSkip}>
              <Text style={styles.nextButtonText}>Tiếp theo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quizContent: {
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 20,
    lineHeight: 26,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.muted,
  },
  optionCorrect: {
    borderColor: '#22c55e',
    backgroundColor: '#dcfce7',
  },
  optionWrong: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  optionKey: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 12,
    minWidth: 24,
  },
  optionKeyHighlight: {
    color: colors.foreground,
  },
  optionValue: {
    fontSize: 16,
    color: colors.foreground,
    flex: 1,
  },
  optionValueHighlight: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  inputCorrect: {
    borderColor: '#22c55e',
    backgroundColor: '#dcfce7',
  },
  inputWrong: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  audioPlayButton: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
  },
  audioPlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  answerReveal: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.muted,
    borderRadius: 12,
  },
  correctAnswerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultCorrect: {
    backgroundColor: '#dcfce7',
  },
  resultWrong: {
    backgroundColor: '#fee2e2',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  skipButton: {
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipButtonText: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
