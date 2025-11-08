import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuizContent, ContentProgress, QuizQuestion } from '~/types/contentTypes';
import { colors } from '~/constants/Color';

interface QuizContentRendererProps {
    content: QuizContent;
    progress?: ContentProgress;
    onComplete: (score?: number) => void;
    onProgress: (progress: Partial<ContentProgress>) => void;
    isPreview?: boolean;
}

export const QuizContentRenderer: React.FC<QuizContentRendererProps> = ({
    content,
    progress,
    onComplete,
    onProgress,
    isPreview = false,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | string[] }>({});
    const [dictationAnswers, setDictationAnswers] = useState<{ [key: string]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(content.timeLimit ? content.timeLimit * 60 : null);
    const [quizStarted, setQuizStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);

    const currentQuestion = content.questions[currentQuestionIndex];
    const totalQuestions = content.questions.length;

    useEffect(() => {
        if (quizStarted && timeLeft !== null && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev && prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev ? prev - 1 : 0;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizStarted, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartQuiz = () => {
        if (isPreview) {
            Alert.alert('Xem trước', 'Vui lòng bắt đầu bài học để làm bài tập');
            return;
        }
        setQuizStarted(true);
        onProgress({
            startedAt: new Date().toISOString(),
            attempts: (progress?.attempts || 0) + 1
        });
    };

    const handleTimeUp = () => {
        Alert.alert('Hết thời gian!', 'Thời gian làm bài đã kết thúc.', [
            { text: 'OK', onPress: () => handleSubmitQuiz() }
        ]);
    };

    const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return colors.success;
            case 'medium':
                return colors.warning;
            case 'hard':
                return colors.destructive;
            default:
                return colors.mutedForeground;
        }
    };

    const playAudio = (audioUrl?: string) => {
        if (audioUrl) {
            // Simulate audio playback
            Alert.alert('Audio', `Playing audio: ${audioUrl}`);
        } else {
            Alert.alert('Audio', 'No audio available');
        }
    };

    const renderWordComparison = (correct: string, userAnswer: string) => {
        const correctWords = correct.toLowerCase().split(' ');
        const userWords = userAnswer.toLowerCase().split(' ');

        return (
            <View style={styles.wordComparisonContainer}>
                {correctWords.map((word, index) => {
                    const isCorrect = userWords[index] === word;
                    return (
                        <View
                            key={index}
                            style={[
                                styles.wordChip,
                                isCorrect ? styles.correctWord : styles.incorrectWord
                            ]}
                        >
                            <Text style={[
                                styles.wordChipText,
                                isCorrect ? styles.correctWordText : styles.incorrectWordText
                            ]}>
                                {word}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        let totalPoints = 0;

        content.questions.forEach(question => {
            totalPoints += question.points;
            const userAnswer = selectedAnswers[question.id];

            if (Array.isArray(question.correctAnswer)) {
                // Multiple correct answers
                if (Array.isArray(userAnswer) &&
                    userAnswer.length === question.correctAnswer.length &&
                    userAnswer.every(ans => question.correctAnswer.includes(ans))) {
                    correctAnswers += question.points;
                }
            } else {
                // Single correct answer
                if (userAnswer === question.correctAnswer) {
                    correctAnswers += question.points;
                }
            }
        });

        return Math.round((correctAnswers / totalPoints) * 100);
    };

    const handleSubmitQuiz = () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setShowResults(true);

        const isCompleted = finalScore >= content.passingScore;
        onProgress({
            isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
            answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
                questionId,
                answer
            }))
        });

        onComplete(finalScore);
    };

    const renderQuestion = (question: QuizQuestion) => {
        const userAnswer = selectedAnswers[question.id];

        switch (question.type) {
            case 'multiple_choice':
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        {question.media && (
                            <View style={styles.mediaContainer}>
                                <Ionicons
                                    name={question.media.type === 'image' ? 'image' : 'volume-high'}
                                    size={24}
                                    color={colors.mutedForeground}
                                />
                                <Text style={styles.mediaText}>
                                    {question.media.type === 'image' ? 'Hình ảnh' : 'Âm thanh'}
                                </Text>
                            </View>
                        )}
                        <View style={styles.optionsContainer}>
                            {question.options?.map((option, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        userAnswer === option && styles.selectedOption
                                    ]}
                                    onPress={() => handleAnswerSelect(question.id, option)}
                                    disabled={showResults}
                                >
                                    <View style={[
                                        styles.optionCircle,
                                        userAnswer === option && styles.selectedOptionCircle
                                    ]}>
                                        <Text style={[
                                            styles.optionLetter,
                                            userAnswer === option && styles.selectedOptionText
                                        ]}>
                                            {String.fromCharCode(65 + index)}
                                        </Text>
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        userAnswer === option && styles.selectedOptionText
                                    ]}>
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );

            case 'true_false':
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <View style={styles.trueFalseContainer}>
                            {['true', 'false'].map((option) => (
                                <Pressable
                                    key={option}
                                    style={[
                                        styles.trueFalseButton,
                                        userAnswer === option && styles.selectedTrueFalse
                                    ]}
                                    onPress={() => handleAnswerSelect(question.id, option)}
                                    disabled={showResults}
                                >
                                    <Ionicons
                                        name={option === 'true' ? 'checkmark' : 'close'}
                                        size={20}
                                        color={userAnswer === option ? 'white' : colors.foreground}
                                    />
                                    <Text style={[
                                        styles.trueFalseText,
                                        userAnswer === option && styles.selectedOptionText
                                    ]}>
                                        {option === 'true' ? 'Đúng' : 'Sai'}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );

            case 'dictation':
                const dictationAnswer = dictationAnswers[question.id] || '';
                return (
                    <View style={styles.questionContainer}>
                        <View style={styles.dictationHeader}>
                            <Text style={styles.questionText}>{question.title || question.question}</Text>
                            {question.difficulty && (
                                <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(question.difficulty)}20` }]}>
                                    <Text style={[styles.difficultyText, { color: getDifficultyColor(question.difficulty) }]}>
                                        {question.difficulty}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.instructionText}>{question.question}</Text>

                        {/* Audio Player */}
                        <View style={styles.audioContainer}>
                            <Pressable
                                style={styles.playButton}
                                onPress={() => playAudio(question.audioUrl)}
                            >
                                <Ionicons name="play" size={24} color="white" />
                            </Pressable>
                            <View style={styles.audioInfo}>
                                <Text style={styles.audioText}>Audio</Text>
                                <Text style={styles.audioHint}>Tap to play audio</Text>
                            </View>
                        </View>

                        {/* Text Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Type what you hear:</Text>
                            <TextInput
                                style={styles.dictationInput}
                                value={dictationAnswer}
                                onChangeText={(text) => {
                                    setDictationAnswers(prev => ({
                                        ...prev,
                                        [question.id]: text
                                    }));
                                    handleAnswerSelect(question.id, text);
                                }}
                                placeholder="Start typing..."
                                multiline
                                textAlignVertical="top"
                                editable={!showResults}
                            />
                        </View>

                        {/* Show Answer Button (if in results mode) */}
                        {showResults && (
                            <View style={styles.answerSection}>
                                <Pressable
                                    style={styles.showAnswerButton}
                                    onPress={() => setShowAnswers(!showAnswers)}
                                >
                                    <Text style={styles.showAnswerButtonText}>
                                        {showAnswers ? 'Hide Answer' : 'Show Answer'}
                                    </Text>
                                    <Ionicons
                                        name={showAnswers ? 'chevron-up' : 'chevron-down'}
                                        size={16}
                                        color={colors.brandCoral}
                                    />
                                </Pressable>

                                {showAnswers && (
                                    <View style={styles.correctAnswerContainer}>
                                        <Text style={styles.correctAnswerLabel}>Correct Answer:</Text>
                                        <Text style={styles.correctAnswerText}>{question.correctAnswer}</Text>

                                        <Text style={styles.yourAnswerLabel}>Your Answer:</Text>
                                        <Text style={styles.yourAnswerText}>{dictationAnswer || 'No answer provided'}</Text>

                                        {/* Word-by-word comparison */}
                                        <View style={styles.comparisonContainer}>
                                            <Text style={styles.comparisonLabel}>Comparison:</Text>
                                            {renderWordComparison(question.correctAnswer as string, dictationAnswer)}
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                );

            default:
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <Text style={styles.unsupportedText}>
                            Loại câu hỏi này chưa được hỗ trợ: {question.type}
                        </Text>
                    </View>
                );
        }
    };

    if (!quizStarted) {
        return (
            <View style={styles.startContainer}>
                <View style={styles.startContent}>
                    <Ionicons name="help-circle" size={64} color={colors.brandCoral} />
                    <Text style={styles.startTitle}>{content.title}</Text>
                    <Text style={styles.startDescription}>{content.content}</Text>

                    <View style={styles.quizInfo}>
                        <View style={styles.infoRow}>
                            <Ionicons name="help" size={16} color={colors.mutedForeground} />
                            <Text style={styles.infoText}>{totalQuestions} câu hỏi</Text>
                        </View>
                        {content.timeLimit && (
                            <View style={styles.infoRow}>
                                <Ionicons name="time" size={16} color={colors.mutedForeground} />
                                <Text style={styles.infoText}>{content.timeLimit} phút</Text>
                            </View>
                        )}
                        <View style={styles.infoRow}>
                            <Ionicons name="trophy" size={16} color={colors.mutedForeground} />
                            <Text style={styles.infoText}>Điểm đạt: {content.passingScore}%</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="refresh" size={16} color={colors.mutedForeground} />
                            <Text style={styles.infoText}>
                                Lượt thử: {progress?.attempts || 0}/{content.maxAttempts}
                            </Text>
                        </View>
                    </View>

                    <Pressable style={styles.startButton} onPress={handleStartQuiz}>
                        <Ionicons name="play" size={20} color="white" />
                        <Text style={styles.startButtonText}>Bắt đầu làm bài</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (showResults) {
        return (
            <View style={styles.resultsContainer}>
                <View style={styles.resultsContent}>
                    <Ionicons
                        name={score >= content.passingScore ? "checkmark-circle" : "close-circle"}
                        size={64}
                        color={score >= content.passingScore ? colors.success : colors.destructive}
                    />
                    <Text style={styles.resultsTitle}>
                        {score >= content.passingScore ? 'Chúc mừng!' : 'Chưa đạt'}
                    </Text>
                    <Text style={styles.scoreText}>Điểm số: {score}%</Text>
                    <Text style={styles.passingScoreText}>
                        Điểm đạt: {content.passingScore}%
                    </Text>

                    <View style={styles.resultStats}>
                        <Text style={styles.resultStatsText}>
                            Đúng: {content.questions.filter(q => {
                                const userAnswer = selectedAnswers[q.id];
                                return Array.isArray(q.correctAnswer)
                                    ? Array.isArray(userAnswer) && userAnswer.every(ans => q.correctAnswer.includes(ans))
                                    : userAnswer === q.correctAnswer;
                            }).length}/{totalQuestions}
                        </Text>
                    </View>

                    <Pressable style={styles.reviewButton} onPress={() => setShowResults(false)}>
                        <Text style={styles.reviewButtonText}>Xem lại đáp án</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Câu {currentQuestionIndex + 1}/{totalQuestions}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[
                            styles.progressFill,
                            { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }
                        ]} />
                    </View>
                </View>
                {timeLeft !== null && (
                    <View style={styles.timerContainer}>
                        <Ionicons name="time" size={16} color={colors.warning} />
                        <Text style={[styles.timerText, timeLeft < 60 && styles.urgentTimer]}>
                            {formatTime(timeLeft)}
                        </Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderQuestion(currentQuestion)}
            </ScrollView>

            {/* Navigation */}
            <View style={styles.navigation}>
                <Pressable
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Ionicons name="chevron-back" size={20} color={
                        currentQuestionIndex === 0 ? colors.mutedForeground : colors.foreground
                    } />
                    <Text style={[
                        styles.navButtonText,
                        currentQuestionIndex === 0 && styles.disabledButtonText
                    ]}>
                        Trước
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.nextButton,
                        !selectedAnswers[currentQuestion.id] && styles.disabledButton
                    ]}
                    onPress={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion.id]}
                >
                    <Text style={[
                        styles.nextButtonText,
                        !selectedAnswers[currentQuestion.id] && styles.disabledButtonText
                    ]}>
                        {currentQuestionIndex === totalQuestions - 1 ? 'Nộp bài' : 'Tiếp'}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={
                        !selectedAnswers[currentQuestion.id] ? colors.mutedForeground : 'white'
                    } />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    startContent: {
        alignItems: 'center',
        maxWidth: 300,
    },
    startTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.foreground,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    startDescription: {
        fontSize: 16,
        color: colors.mutedForeground,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    quizInfo: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        width: '100%',
        marginBottom: 24,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: colors.foreground,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.brandCoral,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    progressContainer: {
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.muted,
        borderRadius: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.brandCoral,
        borderRadius: 2,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timerText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.warning,
    },
    urgentTimer: {
        color: colors.destructive,
    },
    content: {
        flex: 1,
    },
    questionContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 16,
        borderRadius: 12,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
        lineHeight: 26,
        marginBottom: 16,
    },
    mediaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.muted + '40',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    mediaText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        gap: 12,
    },
    selectedOption: {
        borderColor: colors.brandCoral,
        backgroundColor: `${colors.brandCoral}10`,
    },
    optionCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.muted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOptionCircle: {
        backgroundColor: colors.brandCoral,
    },
    optionLetter: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 22,
    },
    selectedOptionText: {
        color: colors.brandCoral,
    },
    trueFalseContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    trueFalseButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        gap: 8,
    },
    selectedTrueFalse: {
        backgroundColor: colors.brandCoral,
        borderColor: colors.brandCoral,
    },
    trueFalseText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    unsupportedText: {
        fontSize: 14,
        color: colors.mutedForeground,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 4,
    },
    navButtonText: {
        fontSize: 16,
        color: colors.foreground,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.brandCoral,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 4,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledButtonText: {
        color: colors.mutedForeground,
    },
    resultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    resultsContent: {
        alignItems: 'center',
        maxWidth: 300,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.foreground,
        marginTop: 16,
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.brandCoral,
        marginBottom: 4,
    },
    passingScoreText: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginBottom: 16,
    },
    resultStats: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    resultStatsText: {
        fontSize: 16,
        color: colors.foreground,
        textAlign: 'center',
    },
    reviewButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.brandCoral,
    },
    reviewButtonText: {
        fontSize: 16,
        color: colors.brandCoral,
        fontWeight: '600',
    },
    // Dictation styles
    dictationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    instructionText: {
        fontSize: 16,
        color: colors.foreground,
        marginBottom: 20,
        lineHeight: 24,
    },
    audioContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    playButton: {
        backgroundColor: colors.brandCoral,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    audioInfo: {
        flex: 1,
    },
    audioText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 4,
    },
    audioHint: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 8,
    },
    dictationInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    answerSection: {
        marginTop: 20,
    },
    showAnswerButton: {
        backgroundColor: colors.brandCoral,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    showAnswerButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    correctAnswerContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f0f9f0',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    correctAnswerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.success,
        marginBottom: 8,
    },
    correctAnswerText: {
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 24,
    },
    // Word comparison styles
    wordComparisonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    wordChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    correctWord: {
        backgroundColor: '#f0f9f0',
        borderColor: colors.success,
    },
    incorrectWord: {
        backgroundColor: '#fdf2f2',
        borderColor: colors.destructive,
    },
    wordChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    correctWordText: {
        color: colors.success,
    },
    incorrectWordText: {
        color: colors.destructive,
    },
    yourAnswerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.mutedForeground,
        marginBottom: 8,
        marginTop: 16,
    },
    yourAnswerText: {
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 24,
        marginBottom: 16,
    },
    comparisonContainer: {
        marginTop: 16,
    },
    comparisonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 12,
    },
});