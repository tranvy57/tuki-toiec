import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StrategyContent, ContentProgress } from '~/types/contentTypes';
import { colors } from '~/constants/Color';

interface StrategyContentRendererProps {
    content: StrategyContent;
    progress?: ContentProgress;
    onComplete: (score?: number) => void;
    onProgress: (progress: Partial<ContentProgress>) => void;
    isPreview?: boolean;
}

export const StrategyContentRenderer: React.FC<StrategyContentRendererProps> = ({
    content,
    progress,
    onComplete,
    onProgress,
    isPreview = false,
}) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['tips']));
    const [isCompleted, setIsCompleted] = useState(progress?.isCompleted || false);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            } else {
                newSet.add(section);
            }
            return newSet;
        });
    };

    const handleComplete = () => {
        setIsCompleted(true);
        onProgress({ isCompleted: true, completedAt: new Date().toISOString() });
        onComplete(100); // Strategy content completion is 100%
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return colors.success;
            case 'intermediate': return colors.warning;
            case 'advanced': return colors.destructive;
            default: return colors.mutedForeground;
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'Cơ bản';
            case 'intermediate': return 'Trung bình';
            case 'advanced': return 'Nâng cao';
            default: return difficulty;
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{content.title}</Text>
                    <View style={styles.metadata}>
                        <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(content.difficulty)}20` }]}>
                            <Text style={[styles.difficultyText, { color: getDifficultyColor(content.difficulty) }]}>
                                {getDifficultyLabel(content.difficulty)}
                            </Text>
                        </View>
                        {content.duration && (
                            <View style={styles.durationContainer}>
                                <Ionicons name="time" size={16} color={colors.mutedForeground} />
                                <Text style={styles.durationText}>{content.duration} phút</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Content Description */}
            <View style={styles.section}>
                <Text style={styles.description}>{content.content}</Text>
            </View>

            {/* Key Points */}
            <View style={styles.section}>
                <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection('keyPoints')}
                >
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="key" size={20} color={colors.info} />
                        <Text style={styles.sectionTitle}>Điểm quan trọng</Text>
                    </View>
                    <Ionicons
                        name={expandedSections.has('keyPoints') ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={colors.mutedForeground}
                    />
                </Pressable>

                {expandedSections.has('keyPoints') && (
                    <View style={styles.sectionContent}>
                        {content.keyPoints.map((point, index) => (
                            <View key={index} style={styles.keyPointItem}>
                                <View style={styles.keyPointBullet}>
                                    <Text style={styles.keyPointNumber}>{index + 1}</Text>
                                </View>
                                <Text style={styles.keyPointText}>{point}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Tips */}
            <View style={styles.section}>
                <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection('tips')}
                >
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="bulb" size={20} color={colors.warning} />
                        <Text style={styles.sectionTitle}>Mẹo và chiến lược</Text>
                    </View>
                    <Ionicons
                        name={expandedSections.has('tips') ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={colors.mutedForeground}
                    />
                </Pressable>

                {expandedSections.has('tips') && (
                    <View style={styles.sectionContent}>
                        {content.tips.map((tip, index) => (
                            <View key={index} style={styles.tipItem}>
                                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                                <Text style={styles.tipText}>{tip}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Examples */}
            {content.examples && content.examples.length > 0 && (
                <View style={styles.section}>
                    <Pressable
                        style={styles.sectionHeader}
                        onPress={() => toggleSection('examples')}
                    >
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="library" size={20} color={colors.brandCoral} />
                            <Text style={styles.sectionTitle}>Ví dụ</Text>
                        </View>
                        <Ionicons
                            name={expandedSections.has('examples') ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.mutedForeground}
                        />
                    </Pressable>

                    {expandedSections.has('examples') && (
                        <View style={styles.sectionContent}>
                            {content.examples.map((example, index) => (
                                <View key={index} style={styles.exampleItem}>
                                    <Text style={styles.exampleText}>{example}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}

            {/* Completion Button */}
            {!isPreview && (
                <View style={styles.actionSection}>
                    <Pressable
                        style={[
                            styles.completeButton,
                            isCompleted && styles.completedButton
                        ]}
                        onPress={handleComplete}
                        disabled={isCompleted}
                    >
                        <Ionicons
                            name={isCompleted ? "checkmark-circle" : "checkmark"}
                            size={20}
                            color="white"
                        />
                        <Text style={styles.completeButtonText}>
                            {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu đã đọc'}
                        </Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
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
    headerContent: {
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.foreground,
        lineHeight: 32,
    },
    metadata: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    section: {
        backgroundColor: 'white',
        marginTop: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    sectionContent: {
        padding: 16,
    },
    description: {
        fontSize: 16,
        color: colors.foreground,
        lineHeight: 24,
        padding: 16,
    },
    keyPointItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 12,
    },
    keyPointBullet: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.info,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    keyPointNumber: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    keyPointText: {
        flex: 1,
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 8,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
    },
    exampleItem: {
        backgroundColor: colors.muted + '40',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.brandCoral,
    },
    exampleText: {
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    actionSection: {
        padding: 20,
        backgroundColor: 'white',
        marginTop: 1,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.brandCoral,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    completedButton: {
        backgroundColor: colors.success,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});