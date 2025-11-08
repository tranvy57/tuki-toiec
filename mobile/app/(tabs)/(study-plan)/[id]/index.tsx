import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyPlan, useLatestCourse } from '~/api/plans/usePlan';
import { useCurrentTask } from '~/hooks/useCurrentTask';
import { ContentRenderer } from '~/components/study-plan/content/ContentRenderer';
import { colors } from '~/constants/Color';

export default function LessonDetail() {
    const { id, phaseId, lessonId, contentId } = useLocalSearchParams<{
        id: string;
        phaseId: string;
        lessonId: string;
        contentId?: string;
    }>();

    const { data: myPlan, isLoading: planLoading, error: planError } = useMyPlan();
    const { data: latestCourse, isLoading: courseLoading, error: courseError } = useLatestCourse();

    // Use the current task hook
    const {
        currentTask,
        currentLesson,
        currentContent,
        currentStudyPlan,
        setCurrentContent,
        startLearning,
        mode,
        completeLearning,
        resetTask
    } = useCurrentTask();

    // console.log("currentTask:", currentTask);
    // console.log("currentLesson:", currentLesson);
    console.log("currentContent:", currentContent);
    console.log("lessonContentItems:", (currentContent as any)?.lessonContentItems);

    // State to control whether to show content renderer
    const [showContentRenderer, setShowContentRenderer] = useState(false);

    const isLoading = planLoading || courseLoading;
    const error = planError || courseError;

    // Use myPlan if available, otherwise fallback to latestCourse
    const course = myPlan || latestCourse;

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.brandCoral} />
                    <Text style={styles.loadingText}>Đang tải bài học...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !course) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>Không thể tải bài học</Text>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Quay lại</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Find the specific phase and lesson
    const phase = course?.phases?.find((p: any) => p.id === phaseId);
    const phaseLesson = phase?.phaseLessons?.find((pl: any) => pl.lesson.id === lessonId);
    const lesson = phaseLesson?.lesson;

    // Use lesson from hook if available, otherwise use from API
    const displayLesson = currentLesson || lesson;

    // Find specific content if contentId is provided
    const selectedContent = contentId ?
        displayLesson?.contents?.find((c: any) => c.id === contentId) : null;

    // Auto-show content renderer when there's a contentId or currentContent
    useEffect(() => {
        if (selectedContent && !currentContent) {
            // If we have a selected content from URL but no current content in hook
            setCurrentContent(selectedContent);
            setShowContentRenderer(true);
        } else if (currentContent && !showContentRenderer) {
            // If we have current content in hook but renderer is not shown
            setShowContentRenderer(true);
        } else if (contentId && displayLesson && !selectedContent) {
            // If contentId in URL but no matching content found, stay on lesson list
            setShowContentRenderer(false);
        }
    }, [contentId, selectedContent, currentContent, displayLesson]);

    if (!displayLesson) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>Không tìm thấy bài học</Text>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Quay lại</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return 'play-circle';
            case 'quiz':
                return 'help-circle';
            case 'vocabulary':
                return 'book';
            case 'strategy':
                return 'bulb';
            case 'explanation':
                return 'document-text';
            default:
                return 'document';
        }
    };

    const getContentTypeColor = (type: string) => {
        switch (type) {
            case 'video':
                return colors.brandCoral;
            case 'quiz':
                return colors.success;
            case 'vocabulary':
                return colors.info;
            case 'strategy':
                return colors.warning;
            case 'explanation':
                return colors.mutedForeground;
            default:
                return colors.foreground;
        }
    };

    const getContentTypeName = (type: string) => {
        switch (type) {
            case 'video':
                return 'Video bài giảng';
            case 'quiz':
                return 'Bài tập';
            case 'vocabulary':
                return 'Từ vựng';
            case 'strategy':
                return 'Chiến lược';
            case 'explanation':
                return 'Giải thích';
            default:
                return 'Nội dung';
        }
    };

    const convertToContentData = (planContent: any) => {
        console.log('Converting content data:', planContent);

        // Convert PlanContent to ContentData format
        const baseContent = {
            id: planContent.id,
            type: planContent.type,
            title: planContent.content || `${getContentTypeName(planContent.type)}`,
            content: planContent.content || '',
            order: planContent.order,
            isPremium: planContent.isPremium || false,
        };

        // Add type-specific properties based on content type
        switch (planContent.type) {
            case 'strategy':
                // Parse strategy content if it's markdown or structured text
                const strategyContent = planContent.content || 'Nội dung chiến lược';
                const sections: any[] = [];

                // Try to parse sections from content
                if (strategyContent.includes('##')) {
                    const lines = strategyContent.split('\n');
                    let currentSection: any = null;
                    let sectionId = 1;

                    lines.forEach((line: string) => {
                        line = line.trim();
                        if (line.startsWith('##')) {
                            if (currentSection) {
                                sections.push(currentSection);
                            }
                            currentSection = {
                                id: sectionId.toString(),
                                title: line.replace('##', '').trim(),
                                content: '',
                                keyPoints: [],
                            };
                            sectionId++;
                        } else if (line.startsWith('-') && currentSection) {
                            currentSection.keyPoints.push(line.replace('-', '').trim());
                        } else if (line && currentSection) {
                            currentSection.content += line + '\n';
                        }
                    });

                    if (currentSection) {
                        sections.push(currentSection);
                    }
                }

                // If no sections parsed, create a default one
                if (sections.length === 0) {
                    sections.push({
                        id: '1',
                        title: 'Chiến lược chính',
                        content: strategyContent,
                        keyPoints: [],
                    });
                }

                return {
                    ...baseContent,
                    category: 'general',
                    difficulty: 'beginner' as const,
                    estimatedTime: 15,
                    sections: sections,
                };

            case 'video':
                return {
                    ...baseContent,
                    videoUrl: planContent.videoUrl || '',
                    duration: planContent.duration || 600,
                    quality: ['720p', '1080p'],
                    subtitles: [{ language: 'vi', url: '' }],
                    chapters: [],
                    transcript: '',
                };

            case 'quiz':
                // Use real quiz data from planContent.lessonContentItems
                const quizItems = planContent.lessonContentItems || [];
                console.log('Quiz items:', quizItems);

                const questions = quizItems.map((contentItem: any, index: number) => {
                    const item = contentItem.item;
                    const prompt = item.promptJsonb || {};
                    const solution = item.solutionJsonb || {};

                    // Handle different modalities
                    if (item.modality === 'dictation') {
                        return {
                            id: item.id || (index + 1).toString(),
                            type: 'dictation' as const,
                            question: prompt.instructions || 'Listen and type what you hear',
                            title: prompt.title || `Question ${index + 1}`,
                            audioUrl: prompt.audio_url || '',
                            correctAnswer: solution.full_transcript || '',
                            sentences: solution.sentences || [],
                            correctAnswers: solution.correct_answers || [],
                            points: 10,
                            difficulty: item.difficulty || 'medium',
                            bandHint: item.bandHint || 450,
                        };
                    } else {
                        // Handle other question types (multiple choice, etc.)
                        return {
                            id: item.id || (index + 1).toString(),
                            type: 'multiple_choice' as const,
                            question: item.question || prompt.instructions || `Question ${index + 1}`,
                            options: item.options || ['A', 'B', 'C', 'D'],
                            correctAnswer: item.correctAnswer || solution.correct_answer || 'A',
                            points: item.points || 1,
                        };
                    }
                });

                return {
                    ...baseContent,
                    timeLimit: planContent.timeLimit || (questions.length * 3), // 3 minutes per question for dictation
                    passingScore: planContent.passingScore || 70,
                    maxAttempts: planContent.maxAttempts || 3,
                    questions: questions.length > 0 ? questions : [
                        {
                            id: '1',
                            type: 'multiple_choice' as const,
                            question: 'Sample question',
                            options: ['A', 'B', 'C', 'D'],
                            correctAnswer: 'A',
                            points: 1,
                        }
                    ],
                };

            case 'explanation':
                // Parse explanation content similar to strategy
                const explanationContent = planContent.content || 'Nội dung giải thích';
                const explanationSections: any[] = [];

                // Try to parse sections from content
                if (explanationContent.includes('##')) {
                    const lines = explanationContent.split('\n');
                    let currentSection: any = null;
                    let sectionId = 1;

                    lines.forEach((line: string) => {
                        line = line.trim();
                        if (line.startsWith('##')) {
                            if (currentSection) {
                                explanationSections.push(currentSection);
                            }
                            currentSection = {
                                id: sectionId.toString(),
                                title: line.replace('##', '').trim(),
                                content: '',
                                keyPoints: [],
                            };
                            sectionId++;
                        } else if (line.startsWith('-') && currentSection) {
                            if (!currentSection.keyPoints) currentSection.keyPoints = [];
                            currentSection.keyPoints.push(line.replace('-', '').trim());
                        } else if (line && currentSection) {
                            currentSection.content += line + '\n';
                        }
                    });

                    if (currentSection) {
                        explanationSections.push(currentSection);
                    }
                }

                // If no sections parsed, create a default one
                if (explanationSections.length === 0) {
                    explanationSections.push({
                        id: '1',
                        title: 'Giải thích',
                        content: explanationContent,
                        keyPoints: [],
                    });
                }

                return {
                    ...baseContent,
                    category: 'grammar',
                    difficulty: 'beginner' as const,
                    estimatedReadTime: Math.ceil(explanationContent.length / 200), // Estimate reading time
                    sections: explanationSections,
                };

            case 'vocabulary':
                // Use real vocabulary data from planContent.vocabularies
                const vocabularies = planContent.vocabularies || [];
                const words = vocabularies.map((vocab: any) => ({
                    id: vocab.id,
                    word: vocab.word,
                    pronunciation: vocab.pronunciation,
                    definition: vocab.meaning,
                    partOfSpeech: vocab.partOfSpeech,
                    difficulty: 'medium' as const, // You can map this based on vocab.type or other fields
                    examples: vocab.exampleEn && vocab.exampleVn ? [
                        {
                            sentence: vocab.exampleEn,
                            translation: vocab.exampleVn,
                        }
                    ] : [],
                    synonyms: [], // Add if available in your data
                    audioUrl: vocab.audioUrl,
                }));

                return {
                    ...baseContent,
                    category: 'general',
                    level: 'intermediate' as const,
                    practiceMode: ['flashcards', 'quiz'],
                    words: words,
                };

            default:
                return baseContent;
        }
    };

    const handleContentPress = (content: any) => {
        console.log('Content pressed:', content);

        // Set the current content in the hook
        if (displayLesson && course) {
            setCurrentContent(content);
            setShowContentRenderer(true);

            // Update URL to highlight the content only if not already set
            if (contentId !== content.id) {
                router.replace(`/(tabs)/(study-plan)/${id}?phaseId=${phaseId}&lessonId=${lessonId}&contentId=${content.id}`);
            }
        }
    };

    const handleStartLearning = () => {
        if (currentContent) {
            startLearning();
            setShowContentRenderer(true);
        }
    };

    const handleContentComplete = (score?: number) => {
        console.log('Content completed with score:', score);
        completeLearning();
        // Could show completion modal or redirect
    };

    const handleContentProgress = (progress: any) => {
        console.log('Content progress:', progress);
        // Handle progress updates here if needed
    };

    const handleBackToLesson = () => {
        setShowContentRenderer(false);
        resetTask();
        router.replace(`/(tabs)/(study-plan)/${id}?phaseId=${phaseId}&lessonId=${lessonId}`);
    };

    // If we're in learning mode and have content, show content renderer
    if ((showContentRenderer && currentContent) || (selectedContent && currentContent)) {
        return (
            <SafeAreaView style={styles.container}>
                {/* Header with back button */}
                {/* <View style={styles.header}>
                    <Pressable style={styles.backButtonHeader} onPress={handleBackToLesson}>
                        <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                    </Pressable>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>{currentContent.content || 'Nội dung bài học'}</Text>
                        <Text style={styles.headerSubtitle}>{displayLesson?.name}</Text>
                    </View>
                    {mode && (
                        <View style={[styles.modeBadgeHeader, { backgroundColor: `${mode === 'learn' ? colors.info : colors.warning}20` }]}>
                            <Text style={[styles.modeTextHeader, { color: mode === 'learn' ? colors.info : colors.warning }]}>
                                {mode === 'learn' ? 'Học mới' : mode === 'review' ? 'Ôn tập' : 'Luyện tập'}
                            </Text>
                        </View>
                    )}
                </View> */}

                {/* Content Renderer */}
                <ContentRenderer
                    content={convertToContentData(currentContent) as any}
                    progress={undefined} // You can pass progress data here if available
                    onComplete={handleContentComplete}
                    onProgress={handleContentProgress}
                    isPreview={false}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButtonHeader} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                </Pressable>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{displayLesson.name}</Text>
                    <Text style={styles.headerSubtitle}>{phase?.title}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Lesson Info */}
                <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{displayLesson.name}</Text>
                    <Text style={styles.lessonDescription}>{displayLesson.description}</Text>
                    <View style={styles.lessonMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="school" size={16} color={colors.mutedForeground} />
                            <Text style={styles.metaText}>Level: {displayLesson.level}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="list" size={16} color={colors.mutedForeground} />
                            <Text style={styles.metaText}>{displayLesson.contents.length} nội dung</Text>
                        </View>
                    </View>
                </View>

                {/* Contents List */}
                <View style={styles.contentsContainer}>
                    <Text style={styles.sectionTitle}>Nội dung bài học</Text>

                    {displayLesson.contents
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((content: any, index: number) => (
                            <Pressable
                                key={content.id}
                                style={[
                                    styles.contentCard,
                                    (contentId === content.id || currentContent?.id === content.id) && styles.highlightedContent
                                ]}
                                onPress={() => handleContentPress(content)}
                            >
                                <View style={styles.contentLeft}>
                                    <View style={[
                                        styles.contentIconContainer,
                                        { backgroundColor: `${getContentTypeColor(content.type)}20` }
                                    ]}>
                                        <Ionicons
                                            name={getContentTypeIcon(content.type) as any}
                                            size={20}
                                            color={getContentTypeColor(content.type)}
                                        />
                                    </View>
                                    <View style={styles.contentInfo}>
                                        <Text style={styles.contentType}>
                                            {getContentTypeName(content.type)}
                                        </Text>
                                        <Text style={styles.contentTitle} numberOfLines={2}>
                                            {content.content || `${getContentTypeName(content.type)} ${index + 1}`}
                                        </Text>
                                        {content.isPremium && (
                                            <View style={styles.premiumBadge}>
                                                <Ionicons name="star" size={12} color={colors.warning} />
                                                <Text style={styles.premiumText}>Premium</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.contentRight}>
                                    <Text style={styles.contentOrder}>{index + 1}</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color={colors.mutedForeground}
                                    />
                                </View>
                            </Pressable>
                        ))}
                </View>

                {/* Selected Content Detail */}
                {(selectedContent || currentContent) && (
                    <View style={styles.selectedContentContainer}>
                        <View style={styles.selectedContentHeader}>
                            <Text style={styles.selectedContentTitle}>
                                {getContentTypeName((selectedContent || currentContent)?.type || '')}
                            </Text>
                            <View style={styles.selectedContentActions}>
                                {currentTask && (
                                    <View style={[styles.modeBadge, { backgroundColor: `${mode === 'learn' ? colors.info : colors.warning}20` }]}>
                                        <Text style={[styles.modeText, { color: mode === 'learn' ? colors.info : colors.warning }]}>
                                            {mode === 'learn' ? 'Học mới' : mode === 'review' ? 'Ôn tập' : 'Luyện tập'}
                                        </Text>
                                    </View>
                                )}
                                <Pressable
                                    style={styles.startButton}
                                    onPress={handleStartLearning}
                                >
                                    <Ionicons name="play" size={16} color="white" />
                                    <Text style={styles.startButtonText}>Bắt đầu</Text>
                                </Pressable>
                            </View>
                        </View>

                        <Text style={styles.selectedContentDescription}>
                            {(selectedContent || currentContent)?.content}
                        </Text>

                        {(selectedContent || currentContent)?.isPremium && (
                            <View style={styles.premiumNotice}>
                                <Ionicons name="star" size={16} color={colors.warning} />
                                <Text style={styles.premiumNoticeText}>Nội dung Premium</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: colors.mutedForeground,
        marginTop: 12,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.destructive,
        textAlign: 'center',
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: colors.brandCoral,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButtonHeader: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    lessonInfo: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 8,
    },
    lessonDescription: {
        fontSize: 16,
        color: colors.mutedForeground,
        lineHeight: 24,
        marginBottom: 16,
    },
    lessonMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    contentsContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 16,
    },
    contentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    highlightedContent: {
        backgroundColor: `${colors.brandCoral}10`,
        borderLeftWidth: 3,
        borderLeftColor: colors.brandCoral,
        marginHorizontal: -4,
        paddingLeft: 8,
    },
    contentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    contentIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentInfo: {
        flex: 1,
    },
    contentType: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.mutedForeground,
        marginBottom: 2,
    },
    contentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 4,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    premiumText: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.warning,
    },
    contentRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contentOrder: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.mutedForeground,
        backgroundColor: colors.muted,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 24,
        textAlign: 'center',
    },
    // New styles for selected content
    selectedContentContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: colors.brandCoral,
    },
    selectedContentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    selectedContentTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
        flex: 1,
    },
    selectedContentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    modeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.brandCoral,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    startButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedContentDescription: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
        marginBottom: 12,
    },
    premiumNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${colors.warning}10`,
        padding: 8,
        borderRadius: 8,
    },
    premiumNoticeText: {
        fontSize: 12,
        color: colors.warning,
        fontWeight: '500',
    },
    modeBadgeHeader: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    modeTextHeader: {
        fontSize: 12,
        fontWeight: '500',
    },
});
