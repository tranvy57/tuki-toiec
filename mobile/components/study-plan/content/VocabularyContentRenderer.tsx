import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VocabularyContent, ContentProgress, VocabularyWord } from '~/types/contentTypes';
import { colors } from '~/constants/Color';

interface VocabularyContentRendererProps {
    content: VocabularyContent;
    progress?: ContentProgress;
    onComplete: () => void;
    onProgress: (progress: Partial<ContentProgress>) => void;
    isPreview?: boolean;
}

export const VocabularyContentRenderer: React.FC<VocabularyContentRendererProps> = ({
    content,
    progress,
    onComplete,
    onProgress,
    isPreview = false,
}) => {
    const [currentMode, setCurrentMode] = useState<'list' | 'flashcards' | 'quiz'>('list');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [learnedWords, setLearnedWords] = useState<string[]>(
        progress?.learnedWords || []
    );
    const [practiceWords, setPracticeWords] = useState<string[]>([]);
    const [quizMode, setQuizMode] = useState<'meaning' | 'pronunciation'>('meaning');
    const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const totalWords = content.words.length;
    const learnedCount = learnedWords.length;
    const progressPercentage = (learnedCount / totalWords) * 100;

    useEffect(() => {
        // Start with unlearned words for flashcards
        const unlearnedWords = content.words
            .filter(word => !learnedWords.includes(word.id))
            .map(word => word.id);
        setPracticeWords(unlearnedWords);
    }, [content.words, learnedWords]);

    const markWordAsLearned = (wordId: string) => {
        if (!learnedWords.includes(wordId)) {
            const newLearnedWords = [...learnedWords, wordId];
            setLearnedWords(newLearnedWords);

            const isCompleted = newLearnedWords.length === totalWords;
            onProgress({
                learnedWords: newLearnedWords,
                isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : undefined
            });

            if (isCompleted) {
                onComplete();
            }
        }
    };

    const toggleWordLearned = (wordId: string) => {
        if (learnedWords.includes(wordId)) {
            const newLearnedWords = learnedWords.filter(id => id !== wordId);
            setLearnedWords(newLearnedWords);
            onProgress({ learnedWords: newLearnedWords, isCompleted: false });
        } else {
            markWordAsLearned(wordId);
        }
    };

    const playPronunciation = (word: VocabularyWord) => {
        // Simulate audio playback
        Alert.alert('Phát âm', `Đang phát âm từ "${word.word}"`);
    };

    const renderDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
        const difficultyConfig = {
            easy: { label: 'Dễ', color: colors.success },
            medium: { label: 'Trung bình', color: colors.warning },
            hard: { label: 'Khó', color: colors.destructive }
        };

        const config = difficultyConfig[difficulty];

        return (
            <View style={[styles.difficultyBadge, { backgroundColor: `${config.color}20` }]}>
                <Text style={[styles.difficultyText, { color: config.color }]}>
                    {config.label}
                </Text>
            </View>
        );
    };

    const renderWordCard = (word: VocabularyWord, isCompact = false) => {
        const isLearned = learnedWords.includes(word.id);

        return (
            <View style={[styles.wordCard, isCompact && styles.compactWordCard]}>
                <View style={styles.wordHeader}>
                    <View style={styles.wordInfo}>
                        <Text style={styles.wordText}>{word.word}</Text>
                        <Text style={styles.pronunciationText}>{word.pronunciation}</Text>
                        {!isCompact && renderDifficultyBadge(word.difficulty)}
                    </View>
                    <View style={styles.wordActions}>
                        <Pressable
                            style={styles.audioButton}
                            onPress={() => playPronunciation(word)}
                        >
                            <Ionicons name="volume-high" size={20} color={colors.brandCoral} />
                        </Pressable>
                        <Pressable
                            style={[styles.learnedButton, isLearned && styles.learnedButtonActive]}
                            onPress={() => toggleWordLearned(word.id)}
                        >
                            <Ionicons
                                name={isLearned ? "checkmark" : "add"}
                                size={16}
                                color={isLearned ? 'white' : colors.brandCoral}
                            />
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.definitionText}>{word.definition}</Text>

                {word.partOfSpeech && (
                    <Text style={styles.partOfSpeechText}>({word.partOfSpeech})</Text>
                )}

                {word.examples && word.examples.length > 0 && !isCompact && (
                    <View style={styles.examplesContainer}>
                        <Text style={styles.examplesTitle}>Ví dụ:</Text>
                        {word.examples.map((example, index) => (
                            <View key={index} style={styles.exampleItem}>
                                <Text style={styles.exampleText}>"{example.sentence}"</Text>
                                {example.translation && (
                                    <Text style={styles.translationText}>→ {example.translation}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {word.synonyms && word.synonyms.length > 0 && !isCompact && (
                    <View style={styles.synonymsContainer}>
                        <Text style={styles.synonymsTitle}>Từ đồng nghĩa:</Text>
                        <Text style={styles.synonymsText}>{word.synonyms.join(', ')}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderFlashcard = () => {
        if (practiceWords.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                    <Text style={styles.emptyTitle}>Hoàn thành!</Text>
                    <Text style={styles.emptyText}>
                        Bạn đã học hết tất cả từ vựng trong bài này
                    </Text>
                    <Pressable
                        style={styles.resetButton}
                        onPress={() => {
                            setPracticeWords(content.words.map(w => w.id));
                            setCurrentCardIndex(0);
                            setShowDefinition(false);
                        }}
                    >
                        <Text style={styles.resetButtonText}>Học lại</Text>
                    </Pressable>
                </View>
            );
        }

        const currentWordId = practiceWords[currentCardIndex];
        const currentWord = content.words.find(w => w.id === currentWordId);

        if (!currentWord) return null;

        return (
            <View style={styles.flashcardContainer}>
                <View style={styles.flashcardHeader}>
                    <Text style={styles.flashcardProgress}>
                        {currentCardIndex + 1} / {practiceWords.length}
                    </Text>
                    <Pressable
                        style={styles.shuffleButton}
                        onPress={() => {
                            const shuffled = [...practiceWords].sort(() => Math.random() - 0.5);
                            setPracticeWords(shuffled);
                            setCurrentCardIndex(0);
                            setShowDefinition(false);
                        }}
                    >
                        <Ionicons name="shuffle" size={20} color={colors.brandCoral} />
                    </Pressable>
                </View>

                <View style={styles.flashcard}>
                    <Pressable
                        style={styles.flashcardContent}
                        onPress={() => setShowDefinition(!showDefinition)}
                    >
                        {!showDefinition ? (
                            <View style={styles.flashcardFront}>
                                <Text style={styles.flashcardWord}>{currentWord.word}</Text>
                                <Text style={styles.flashcardPronunciation}>{currentWord.pronunciation}</Text>
                                <Pressable
                                    style={styles.flashcardAudioButton}
                                    onPress={() => playPronunciation(currentWord)}
                                >
                                    <Ionicons name="volume-high" size={24} color={colors.brandCoral} />
                                </Pressable>
                                <Text style={styles.flashcardHint}>Nhấn để xem nghĩa</Text>
                            </View>
                        ) : (
                            <View style={styles.flashcardBack}>
                                <Text style={styles.flashcardDefinition}>{currentWord.definition}</Text>
                                {currentWord.partOfSpeech && (
                                    <Text style={styles.flashcardPartOfSpeech}>({currentWord.partOfSpeech})</Text>
                                )}
                                {currentWord.examples && currentWord.examples[0] && (
                                    <Text style={styles.flashcardExample}>
                                        "{currentWord.examples[0].sentence}"
                                    </Text>
                                )}
                            </View>
                        )}
                    </Pressable>
                </View>

                <View style={styles.flashcardActions}>
                    <Pressable
                        style={[styles.flashcardButton, styles.difficultButton]}
                        onPress={() => {
                            // Move to end of practice queue
                            const newPracticeWords = [...practiceWords];
                            const word = newPracticeWords.splice(currentCardIndex, 1)[0];
                            newPracticeWords.push(word);
                            setPracticeWords(newPracticeWords);
                            setShowDefinition(false);
                            if (currentCardIndex >= newPracticeWords.length) {
                                setCurrentCardIndex(0);
                            }
                        }}
                    >
                        <Ionicons name="refresh" size={20} color={colors.destructive} />
                        <Text style={[styles.flashcardButtonText, { color: colors.destructive }]}>
                            Khó
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.flashcardButton, styles.easyButton]}
                        onPress={() => {
                            markWordAsLearned(currentWord.id);
                            const newPracticeWords = practiceWords.filter(id => id !== currentWord.id);
                            setPracticeWords(newPracticeWords);
                            setShowDefinition(false);
                            if (currentCardIndex >= newPracticeWords.length) {
                                setCurrentCardIndex(Math.max(0, newPracticeWords.length - 1));
                            }
                        }}
                    >
                        <Ionicons name="checkmark" size={20} color={colors.success} />
                        <Text style={[styles.flashcardButtonText, { color: colors.success }]}>
                            Biết rồi
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    const renderQuiz = () => {
        const quizWords = content.words.slice(0, Math.min(10, content.words.length));

        return (
            <View style={styles.quizContainer}>
                <View style={styles.quizHeader}>
                    <Text style={styles.quizTitle}>Kiểm tra từ vựng</Text>
                    <View style={styles.quizModeSelector}>
                        <Pressable
                            style={[
                                styles.quizModeButton,
                                quizMode === 'meaning' && styles.activeQuizModeButton
                            ]}
                            onPress={() => setQuizMode('meaning')}
                        >
                            <Text style={[
                                styles.quizModeText,
                                quizMode === 'meaning' && styles.activeQuizModeText
                            ]}>
                                Nghĩa
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.quizModeButton,
                                quizMode === 'pronunciation' && styles.activeQuizModeButton
                            ]}
                            onPress={() => setQuizMode('pronunciation')}
                        >
                            <Text style={[
                                styles.quizModeText,
                                quizMode === 'pronunciation' && styles.activeQuizModeText
                            ]}>
                                Phát âm
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <ScrollView style={styles.quizContent}>
                    {quizWords.map((word, index) => (
                        <View key={word.id} style={styles.quizQuestion}>
                            <Text style={styles.quizQuestionText}>
                                {index + 1}. {quizMode === 'meaning' ? word.word : word.definition}
                            </Text>
                            <Text style={styles.quizPrompt}>
                                {quizMode === 'meaning' ? 'Nghĩa là:' : 'Từ vựng:'}
                            </Text>
                            <Text style={styles.quizAnswer}>
                                {quizMode === 'meaning' ? word.definition : word.word}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{content.title}</Text>
                <Text style={styles.description}>{content.content}</Text>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                            Đã học: {learnedCount}/{totalWords} từ
                        </Text>
                        <Text style={styles.progressPercentage}>
                            {Math.round(progressPercentage)}%
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[
                            styles.progressFill,
                            { width: `${progressPercentage}%` }
                        ]} />
                    </View>
                </View>

                {/* Mode Selector */}
                <View style={styles.modeSelector}>
                    <Pressable
                        style={[styles.modeButton, currentMode === 'list' && styles.activeModeButton]}
                        onPress={() => setCurrentMode('list')}
                    >
                        <Ionicons name="list" size={16} color={
                            currentMode === 'list' ? 'white' : colors.brandCoral
                        } />
                        <Text style={[
                            styles.modeButtonText,
                            currentMode === 'list' && styles.activeModeButtonText
                        ]}>
                            Danh sách
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.modeButton, currentMode === 'flashcards' && styles.activeModeButton]}
                        onPress={() => setCurrentMode('flashcards')}
                    >
                        <Ionicons name="layers" size={16} color={
                            currentMode === 'flashcards' ? 'white' : colors.brandCoral
                        } />
                        <Text style={[
                            styles.modeButtonText,
                            currentMode === 'flashcards' && styles.activeModeButtonText
                        ]}>
                            Thẻ ghi nhớ
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.modeButton, currentMode === 'quiz' && styles.activeModeButton]}
                        onPress={() => setCurrentMode('quiz')}
                    >
                        <Ionicons name="help-circle" size={16} color={
                            currentMode === 'quiz' ? 'white' : colors.brandCoral
                        } />
                        <Text style={[
                            styles.modeButtonText,
                            currentMode === 'quiz' && styles.activeModeButtonText
                        ]}>
                            Kiểm tra
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {currentMode === 'list' && (
                    <ScrollView style={styles.wordsList} showsVerticalScrollIndicator={false}>
                        <View style={styles.wordsContainer}>
                            {content.words.map(word => renderWordCard(word))}
                        </View>
                    </ScrollView>
                )}

                {currentMode === 'flashcards' && renderFlashcard()}

                {currentMode === 'quiz' && renderQuiz()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: colors.mutedForeground,
        lineHeight: 24,
        marginBottom: 16,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.brandCoral,
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
    modeSelector: {
        flexDirection: 'row',
        backgroundColor: colors.muted + '40',
        borderRadius: 8,
        padding: 4,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        gap: 4,
    },
    activeModeButton: {
        backgroundColor: colors.brandCoral,
    },
    modeButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.brandCoral,
    },
    activeModeButtonText: {
        color: 'white',
    },
    content: {
        flex: 1,
    },
    // Word List Styles
    wordsList: {
        flex: 1,
    },
    wordsContainer: {
        padding: 16,
        gap: 12,
    },
    wordCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    compactWordCard: {
        padding: 12,
    },
    wordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    wordInfo: {
        flex: 1,
        gap: 4,
    },
    wordText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.foreground,
    },
    pronunciationText: {
        fontSize: 14,
        color: colors.mutedForeground,
        fontStyle: 'italic',
    },
    wordActions: {
        flexDirection: 'row',
        gap: 8,
    },
    audioButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: `${colors.brandCoral}20`,
    },
    learnedButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.brandCoral,
    },
    learnedButtonActive: {
        backgroundColor: colors.brandCoral,
    },
    definitionText: {
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 22,
    },
    partOfSpeechText: {
        fontSize: 14,
        color: colors.mutedForeground,
        fontStyle: 'italic',
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    examplesContainer: {
        marginTop: 8,
        gap: 8,
    },
    examplesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    exampleItem: {
        backgroundColor: colors.muted + '20',
        padding: 12,
        borderRadius: 8,
        gap: 4,
    },
    exampleText: {
        fontSize: 14,
        color: colors.foreground,
        fontStyle: 'italic',
    },
    translationText: {
        fontSize: 13,
        color: colors.mutedForeground,
    },
    synonymsContainer: {
        marginTop: 8,
        gap: 4,
    },
    synonymsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    synonymsText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    // Flashcard Styles
    flashcardContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    flashcardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    flashcardProgress: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    shuffleButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: `${colors.brandCoral}20`,
    },
    flashcard: {
        height: 300,
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    flashcardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    flashcardFront: {
        alignItems: 'center',
        gap: 12,
    },
    flashcardWord: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.foreground,
        textAlign: 'center',
    },
    flashcardPronunciation: {
        fontSize: 18,
        color: colors.mutedForeground,
        fontStyle: 'italic',
    },
    flashcardAudioButton: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: `${colors.brandCoral}20`,
        marginTop: 8,
    },
    flashcardHint: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginTop: 16,
    },
    flashcardBack: {
        alignItems: 'center',
        gap: 12,
    },
    flashcardDefinition: {
        fontSize: 20,
        color: colors.foreground,
        textAlign: 'center',
        lineHeight: 28,
    },
    flashcardPartOfSpeech: {
        fontSize: 16,
        color: colors.mutedForeground,
        fontStyle: 'italic',
    },
    flashcardExample: {
        fontSize: 16,
        color: colors.mutedForeground,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 8,
    },
    flashcardActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    flashcardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    difficultButton: {
        backgroundColor: `${colors.destructive}20`,
    },
    easyButton: {
        backgroundColor: `${colors.success}20`,
    },
    flashcardButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.foreground,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: colors.mutedForeground,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    resetButton: {
        backgroundColor: colors.brandCoral,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    // Quiz Styles
    quizContainer: {
        flex: 1,
    },
    quizHeader: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    quizTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 16,
    },
    quizModeSelector: {
        flexDirection: 'row',
        backgroundColor: colors.muted + '40',
        borderRadius: 8,
        padding: 4,
    },
    quizModeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    activeQuizModeButton: {
        backgroundColor: colors.brandCoral,
    },
    quizModeText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.brandCoral,
    },
    activeQuizModeText: {
        color: 'white',
    },
    quizContent: {
        flex: 1,
    },
    quizQuestion: {
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    quizQuestionText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    quizPrompt: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    quizAnswer: {
        fontSize: 16,
        color: colors.brandCoral,
        fontWeight: '600',
    },
});