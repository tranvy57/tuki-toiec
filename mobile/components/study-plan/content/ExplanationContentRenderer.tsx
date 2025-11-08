import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExplanationContent, ContentProgress, ExplanationSection } from '~/types/contentTypes';
import { colors } from '~/constants/Color';

interface ExplanationContentRendererProps {
    content: ExplanationContent;
    progress?: ContentProgress;
    onComplete: () => void;
    onProgress: (progress: Partial<ContentProgress>) => void;
    isPreview?: boolean;
}

export const ExplanationContentRenderer: React.FC<ExplanationContentRendererProps> = ({
    content,
    progress,
    onComplete,
    onProgress,
    isPreview = false,
}) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [readSections, setReadSections] = useState<string[]>(
        progress?.sectionsRead || []
    );

    const totalSections = content.sections.length;
    const readSectionsCount = readSections.length;
    const progressPercentage = (readSectionsCount / totalSections) * 100;

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const markSectionAsRead = (sectionId: string) => {
        if (!readSections.includes(sectionId)) {
            const newReadSections = [...readSections, sectionId];
            setReadSections(newReadSections);

            const isCompleted = newReadSections.length === totalSections;
            onProgress({
                sectionsRead: newReadSections,
                isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : undefined
            });

            if (isCompleted) {
                onComplete();
            }
        }
    };

    const navigateToSection = (index: number) => {
        setCurrentSectionIndex(index);
        const section = content.sections[index];
        markSectionAsRead(section.id);
    };

    const renderDifficultyBadge = (difficulty?: 'beginner' | 'intermediate' | 'advanced') => {
        if (!difficulty) return null;

        const difficultyConfig = {
            beginner: { label: 'Cơ bản', color: colors.success },
            intermediate: { label: 'Trung bình', color: colors.warning },
            advanced: { label: 'Nâng cao', color: colors.destructive }
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

    const renderMedia = (media?: { type: 'image' | 'audio' | 'video'; url: string; caption?: string }) => {
        if (!media) return null;

        return (
            <View style={styles.mediaContainer}>
                <View style={styles.mediaPlaceholder}>
                    <Ionicons
                        name={
                            media.type === 'image' ? 'image' :
                                media.type === 'audio' ? 'volume-high' : 'videocam'
                        }
                        size={32}
                        color={colors.mutedForeground}
                    />
                    <Text style={styles.mediaText}>
                        {media.type === 'image' ? 'Hình ảnh' :
                            media.type === 'audio' ? 'Âm thanh' : 'Video'}
                    </Text>
                </View>
                {media.caption && (
                    <Text style={styles.mediaCaption}>{media.caption}</Text>
                )}
            </View>
        );
    };

    const renderKeyPoints = (keyPoints?: string[]) => {
        if (!keyPoints || keyPoints.length === 0) return null;

        return (
            <View style={styles.keyPointsContainer}>
                <Text style={styles.keyPointsTitle}>Điểm chính:</Text>
                {keyPoints.map((point, index) => (
                    <View key={index} style={styles.keyPointItem}>
                        <View style={styles.keyPointBullet} />
                        <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderExamples = (examples?: { title: string; content: string; correct?: boolean }[]) => {
        if (!examples || examples.length === 0) return null;

        return (
            <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Ví dụ:</Text>
                {examples.map((example, index) => (
                    <View key={index} style={[
                        styles.exampleItem,
                        example.correct === true && styles.correctExample,
                        example.correct === false && styles.incorrectExample
                    ]}>
                        <View style={styles.exampleHeader}>
                            {example.correct !== undefined && (
                                <Ionicons
                                    name={example.correct ? 'checkmark-circle' : 'close-circle'}
                                    size={16}
                                    color={example.correct ? colors.success : colors.destructive}
                                />
                            )}
                            <Text style={styles.exampleTitle}>{example.title}</Text>
                        </View>
                        <Text style={styles.exampleContent}>{example.content}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderSection = (section: ExplanationSection, index: number) => {
        const isExpanded = expandedSections.includes(section.id);
        const isRead = readSections.includes(section.id);
        const isCurrent = index === currentSectionIndex;

        return (
            <View key={section.id} style={[
                styles.sectionContainer,
                isCurrent && styles.currentSection
            ]}>
                <Pressable
                    style={styles.sectionHeader}
                    onPress={() => {
                        toggleSection(section.id);
                        if (!isRead) {
                            markSectionAsRead(section.id);
                        }
                    }}
                >
                    <View style={styles.sectionHeaderLeft}>
                        <View style={[
                            styles.sectionNumber,
                            isRead && styles.readSectionNumber
                        ]}>
                            <Text style={[
                                styles.sectionNumberText,
                                isRead && styles.readSectionNumberText
                            ]}>
                                {index + 1}
                            </Text>
                        </View>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={[styles.sectionTitle, isRead && styles.readSectionTitle]}>
                                {section.title}
                            </Text>
                            {renderDifficultyBadge(section.difficulty)}
                        </View>
                    </View>
                    <View style={styles.sectionHeaderRight}>
                        {isRead && (
                            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        )}
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.mutedForeground}
                        />
                    </View>
                </Pressable>

                {isExpanded && (
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionText}>{section.content}</Text>

                        {renderMedia(section.media)}
                        {renderKeyPoints(section.keyPoints)}
                        {renderExamples(section.examples)}

                        {section.notes && (
                            <View style={styles.notesContainer}>
                                <Ionicons name="information-circle" size={16} color={colors.warning} />
                                <Text style={styles.notesText}>{section.notes}</Text>
                            </View>
                        )}
                    </View>
                )}
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
                            Đã đọc: {readSectionsCount}/{totalSections} phần
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

                {renderDifficultyBadge(content.difficulty)}
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionsContainer}>
                    {content.sections.map((section, index) => renderSection(section, index))}
                </View>

                {/* Summary */}
                {content.summary && (
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryHeader}>
                            <Ionicons name="document-text" size={20} color={colors.brandCoral} />
                            <Text style={styles.summaryTitle}>Tóm tắt</Text>
                        </View>
                        <Text style={styles.summaryText}>{content.summary}</Text>
                    </View>
                )}

                {/* Related Topics */}
                {content.relatedTopics && content.relatedTopics.length > 0 && (
                    <View style={styles.relatedContainer}>
                        <Text style={styles.relatedTitle}>Chủ đề liên quan:</Text>
                        <View style={styles.relatedTopics}>
                            {content.relatedTopics.map((topic, index) => (
                                <View key={index} style={styles.relatedTopic}>
                                    <Text style={styles.relatedTopicText}>{topic}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Quick Navigation */}
            {totalSections > 1 && (
                <View style={styles.navigation}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.navigationScroll}
                    >
                        {content.sections.map((section, index) => (
                            <Pressable
                                key={section.id}
                                style={[
                                    styles.navButton,
                                    index === currentSectionIndex && styles.activeNavButton,
                                    readSections.includes(section.id) && styles.readNavButton
                                ]}
                                onPress={() => navigateToSection(index)}
                            >
                                <Text style={[
                                    styles.navButtonText,
                                    index === currentSectionIndex && styles.activeNavButtonText,
                                    readSections.includes(section.id) && styles.readNavButtonText
                                ]}>
                                    {index + 1}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
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
        marginBottom: 12,
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
    content: {
        flex: 1,
    },
    sectionsContainer: {
        padding: 16,
        gap: 12,
    },
    sectionContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    currentSection: {
        borderWidth: 2,
        borderColor: colors.brandCoral,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    sectionHeaderLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.muted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    readSectionNumber: {
        backgroundColor: colors.success,
    },
    sectionNumberText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    readSectionNumberText: {
        color: 'white',
    },
    sectionTitleContainer: {
        flex: 1,
        gap: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    readSectionTitle: {
        color: colors.success,
    },
    sectionHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionContent: {
        padding: 16,
        paddingTop: 0,
        gap: 16,
    },
    sectionText: {
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 24,
    },
    mediaContainer: {
        gap: 8,
    },
    mediaPlaceholder: {
        backgroundColor: colors.muted + '40',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        gap: 8,
    },
    mediaText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    mediaCaption: {
        fontSize: 14,
        color: colors.mutedForeground,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    keyPointsContainer: {
        backgroundColor: `${colors.brandCoral}10`,
        padding: 16,
        borderRadius: 8,
        gap: 12,
    },
    keyPointsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.brandCoral,
    },
    keyPointItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    keyPointBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.brandCoral,
        marginTop: 8,
    },
    keyPointText: {
        flex: 1,
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
    },
    examplesContainer: {
        gap: 12,
    },
    examplesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    exampleItem: {
        backgroundColor: colors.muted + '20',
        padding: 16,
        borderRadius: 8,
        gap: 8,
    },
    correctExample: {
        backgroundColor: `${colors.success}20`,
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    incorrectExample: {
        backgroundColor: `${colors.destructive}20`,
        borderLeftWidth: 4,
        borderLeftColor: colors.destructive,
    },
    exampleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    exampleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    exampleContent: {
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
    },
    notesContainer: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: `${colors.warning}20`,
        padding: 12,
        borderRadius: 8,
    },
    notesText: {
        flex: 1,
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
    },
    summaryContainer: {
        backgroundColor: 'white',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.brandCoral,
    },
    summaryText: {
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 24,
    },
    relatedContainer: {
        backgroundColor: 'white',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    relatedTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    relatedTopics: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    relatedTopic: {
        backgroundColor: colors.muted + '40',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    relatedTopicText: {
        fontSize: 12,
        color: colors.foreground,
    },
    navigation: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    navigationScroll: {
        padding: 16,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.muted,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    activeNavButton: {
        backgroundColor: colors.brandCoral,
    },
    readNavButton: {
        backgroundColor: colors.success,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.foreground,
    },
    activeNavButtonText: {
        color: 'white',
    },
    readNavButtonText: {
        color: 'white',
    },
});