import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useReviewMenuData, findLessonById, getModalityDisplayName } from '~/hooks/useCurrentReview';
import { useCurrentLesson } from '~/hooks/useCurrentLesson';
import Dictation from '~/components/review/listening/Dictation';

const initialLayout = { width: Dimensions.get('window').width };

interface DictationSegment {
    text: string;
    start_time: number;
    end_time: number;
}

interface DictationCorrectAnswer {
    segment_index: number;
    start_position: number;
    end_position: number;
    text: string;
}

interface DictationItem {
    id: number;
    title: string;
    difficulty: string;
    promptJsonb: {
        title?: string;
        instructions?: string;
        audio_url: string;
        segments: DictationSegment[];
        correct_answers: DictationCorrectAnswer[];
    };
}

const ListeningPracticeScreen = () => {
    const { skill, lessonId } = useLocalSearchParams();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'practice', title: 'Listening Practice' },
        { key: 'results', title: 'Results' },
    ]);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [isCompleted, setIsCompleted] = useState(false);

    console.log(skill, lessonId);

    // Get lesson data from Zustand store
    const {
        currentLesson,
        currentModality,
        currentLessonId,
        currentItem,
        totalItems
    } = useCurrentLesson();

    // Fallback: if no lesson in store, try to load from menuData
    const { data: menuData, isLoading, isError } = useReviewMenuData(
        skill as string,
        !currentLesson // only load if no current lesson
    );

    console.log('Current lesson from store:', currentLesson);
    console.log('MenuData (fallback):', menuData);

    // If no current lesson but we have lessonId, find it in menuData
    React.useEffect(() => {
        if (!currentLesson && lessonId && menuData) {
            const foundLesson = findLessonById(menuData, lessonId as string);
            if (foundLesson) {
                console.warn('Lesson not found in store, using fallback from menuData');
            }
        }
    }, [currentLesson, lessonId, menuData]);

    // Use current lesson data
    const lessonData = currentLesson;

    const getCurrentDictationItem = (): DictationItem | null => {
        if (!lessonData || !lessonData.items.length) {
            // Sample dictation data for development
            return {
                id: 1,
                title: 'Sample Dictation Exercise',
                difficulty: 'Intermediate',
                promptJsonb: {
                    title: 'Daily Conversation',
                    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Sample audio
                    instructions: 'Listen to the audio and fill in the missing words in each segment.',
                    segments: [
                        {
                            start_time: 0,
                            end_time: 3,
                            text: 'Hello, how are you today?'
                        },
                        {
                            start_time: 3,
                            end_time: 6,
                            text: 'I am fine, thank you very much.'
                        },
                        {
                            start_time: 6,
                            end_time: 9,
                            text: 'What are you doing this weekend?'
                        }
                    ],
                    correct_answers: [
                        {
                            segment_index: 0,
                            start_position: 0,
                            end_position: 5,
                            text: 'Hello'
                        },
                        {
                            segment_index: 1,
                            start_position: 5,
                            end_position: 9,
                            text: 'fine'
                        },
                        {
                            segment_index: 2,
                            start_position: 17,
                            end_position: 24,
                            text: 'weekend'
                        }
                    ]
                }
            };
        }

        const currentItem = lessonData.items[0];

        // Check if this is a dictation type exercise
        if (currentItem.modality === 'dictation' || currentItem.modality === 'fill_in_blanks') {
            return {
                id: parseInt(currentItem.id) || 1,
                title: currentItem.promptJsonb.title || lessonData.name,
                difficulty: lessonData.difficulty || 'Intermediate',
                promptJsonb: {
                    title: currentItem.promptJsonb.title,
                    segments: (currentItem.promptJsonb.segments || []).map(seg => ({
                        text: seg.text,
                        start_time: seg.start,
                        end_time: seg.end
                    })),
                    audio_url: currentItem.promptJsonb.audio_url || '',
                    instructions: currentItem.promptJsonb.instructions || 'Listen and fill in the missing words.',
                    correct_answers: (currentItem.solutionJsonb?.correct_answers || []).map((answer, index) => ({
                        segment_index: answer.segment_index,
                        start_position: 0,
                        end_position: answer.text.length,
                        text: answer.text
                    }))
                }
            };
        }

        // Convert other listening exercises to dictation format if possible
        return {
            id: parseInt(currentItem.id) || 1,
            title: currentItem.promptJsonb.title || lessonData.name,
            difficulty: lessonData.difficulty || 'Intermediate',
            promptJsonb: {
                title: currentItem.promptJsonb.title,
                audio_url: currentItem.promptJsonb.audio_url || '',
                instructions: currentItem.promptJsonb.instructions || 'Listen to the audio carefully.',
                segments: [],
                correct_answers: []
            }
        };
    };

    const currentDictationItem = getCurrentDictationItem();

    const handleDictationComplete = (answers: { [key: number]: string }) => {
        setUserAnswers(answers);
        setIsCompleted(true);
        console.log('Dictation completed with answers:', answers);
    };

    const handleDictationSubmit = (answers: { [key: number]: string }) => {
        setUserAnswers(answers);
        setIsCompleted(true);
        console.log('Dictation submitted with answers:', answers);
        // Switch to results tab after submission
        setIndex(1);
        // Here you would typically send the answers to your backend
    };

    const calculateResults = () => {
        if (!currentDictationItem || !currentDictationItem.promptJsonb.correct_answers) {
            return { score: 0, total: 0, percentage: 0 };
        }

        const correctAnswers = currentDictationItem.promptJsonb.correct_answers;
        const total = correctAnswers.length;
        let correct = 0;

        correctAnswers.forEach((answer: DictationCorrectAnswer, index: number) => {
            const userAnswer = userAnswers[answer.segment_index];
            if (userAnswer && userAnswer.toLowerCase().trim() === answer.text.toLowerCase().trim()) {
                correct++;
            }
        });

        return {
            score: correct,
            total: total,
            percentage: total > 0 ? Math.round((correct / total) * 100) : 0
        };
    };

    const DictationPracticeRoute = () => {
        if (!currentDictationItem) {
            return (
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.errorText}>No dictation exercise available</Text>
                </View>
            );
        }

        return (
            <Dictation
                item={currentDictationItem}
                onSubmit={handleDictationSubmit}
            />
        );
    };

    const ResultsRoute = () => {
        const results = calculateResults();

        return (
            <View style={styles.resultsContainer}>
                <View style={styles.resultsCard}>
                    <Text style={styles.resultsTitle}>Your Results</Text>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>
                            {results.score} / {results.total}
                        </Text>
                        <Text style={styles.percentageText}>
                            {results.percentage}%
                        </Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <View style={[
                            styles.progressBar,
                            { width: `${results.percentage}%` }
                        ]} />
                    </View>

                    <Text style={styles.resultsDescription}>
                        {results.percentage >= 80
                            ? 'Excellent work! You have great listening skills.'
                            : results.percentage >= 60
                                ? 'Good job! Keep practicing to improve.'
                                : 'Keep practicing. You\'ll get better with time.'}
                    </Text>

                    {currentDictationItem && (
                        <View style={styles.answersSection}>
                            <Text style={styles.answersTitle}>Review Your Answers:</Text>
                            {currentDictationItem.promptJsonb.correct_answers?.map((answer: DictationCorrectAnswer, index: number) => {
                                const userAnswer = userAnswers[answer.segment_index];
                                const isCorrect = userAnswer &&
                                    userAnswer.toLowerCase().trim() === answer.text.toLowerCase().trim();

                                return (
                                    <View key={index} style={styles.answerRow}>
                                        <Text style={styles.segmentNumber}>#{answer.segment_index + 1}</Text>
                                        <View style={styles.answerComparison}>
                                            <Text style={[
                                                styles.userAnswer,
                                                isCorrect ? styles.correctAnswer : styles.incorrectAnswer
                                            ]}>
                                                Your answer: {userAnswer || '(no answer)'}
                                            </Text>
                                            <Text style={styles.correctAnswerText}>
                                                Correct answer: {answer.text}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderScene = SceneMap({
        practice: DictationPracticeRoute,
        results: ResultsRoute,
    });

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor="#2563eb"
            inactiveColor="#666"
            pressColor="rgba(37, 99, 235, 0.1)"
        />
    );

    // Loading state - only show loading if no lesson in store and still loading menuData
    if (!currentLesson && isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.loadingText}>Đang tải bài tập...</Text>
            </View>
        );
    }

    // Error state
    if (!currentLesson && (isError || !menuData)) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Có lỗi xảy ra khi tải bài tập</Text>
            </View>
        );
    }

    // Lesson not found
    if (!lessonData) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Không tìm thấy bài tập</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Display skill info */}
            <View style={styles.skillHeader}>
                <Text style={styles.skillTitle}>
                    {getModalityDisplayName(skill as string)}
                </Text>
                <Text style={styles.lessonTitle}>
                    {lessonData.name}
                </Text>
                {currentDictationItem && (
                    <Text style={styles.difficultyText}>
                        Difficulty: {currentDictationItem.difficulty}
                    </Text>
                )}
            </View>

            {/* TabView */}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    skillHeader: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    skillTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    lessonTitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    difficultyText: {
        fontSize: 12,
        color: '#8B5CF6',
        fontWeight: '500',
    },
    tabBar: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tabIndicator: {
        backgroundColor: '#2563eb',
        height: 3,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'none',
    },

    // Results styles
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    resultsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 20,
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#10B981',
        marginTop: 8,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    resultsDescription: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    answersSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 20,
    },
    answersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    answerRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    segmentNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        width: 40,
        paddingTop: 2,
    },
    answerComparison: {
        flex: 1,
    },
    userAnswer: {
        fontSize: 14,
        marginBottom: 4,
    },
    correctAnswer: {
        color: '#10B981',
    },
    incorrectAnswer: {
        color: '#EF4444',
    },
    correctAnswerText: {
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
    },
});

export default ListeningPracticeScreen;
