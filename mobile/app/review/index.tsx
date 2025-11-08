import React, { useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSkillStore } from '~/store/skillStore';
import { SkillType } from '~/types/skillTypes';
import { useReviewMenuData, findLessonById, getModalityIcon, getModalitySkillType } from '~/hooks/useCurrentReview';
import { useCurrentLesson } from '~/hooks/useCurrentLesson';

export default function EnhancedSkillReview() {
    const { skill } = useLocalSearchParams() as { skill?: string };
    const router = useRouter();

    // Local state to manage expanded sections
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());

    // Current lesson store
    const { setCurrentLesson } = useCurrentLesson();

    const {
        sections,
        toggleSectionExpansion,
        setSelectedSkill,
    } = useSkillStore();

    const skillType = skill as SkillType;
    const skillSections = sections[skillType] || [];


    React.useEffect(() => {
        if (skillType) {
            setSelectedSkill(skillType);
        }
    }, [skillType, setSelectedSkill]);

    const skillNames = {
        listening: 'Nghe hiểu',
        reading: 'Đọc hiểu',
        speaking: 'Luyện nói',
        writing: 'Viết',
    };

    const skillName = skillNames[skillType] || skill;

    const handleSectionToggle = (sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    const handleTestPress = (lessonId: string, modality: string) => {
        // Find the lesson in menuData
        const selectedLesson = findLessonById(menuData!, lessonId);

        if (selectedLesson) {
            // Save lesson to Zustand store
            setCurrentLesson(selectedLesson, modality);

            // Navigate to the appropriate route based on skill type
            const skillType = getModalitySkillType(modality);
            console.log(skillType)
            router.push(`/review/${skillType}/${modality}?lessonId=${lessonId}&modality=${modality}`);
        }
    }; const { data: menuData, isLoading, isError } = useReviewMenuData(skill);


    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (isError || !menuData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>Có lỗi xảy ra khi tải dữ liệu</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionsContainer}>
                {Object.values(menuData).map((modalitySection) => (
                    <View key={modalitySection.modality} style={styles.sectionCard}>
                        <Pressable
                            style={styles.sectionHeader}
                            onPress={() => handleSectionToggle(modalitySection.modality)}
                        >
                            <View style={styles.sectionIcon}>
                                <FontAwesome5
                                    name={getModalityIcon(modalitySection.modality) as any}
                                    size={24}
                                    color="#10B981"
                                />
                            </View>

                            <View style={styles.sectionContent}>
                                <Text style={styles.sectionTitle}>{modalitySection.name}</Text>
                                <Text style={styles.sectionProgress}>
                                    {modalitySection.lessons.length} bài học - {modalitySection.totalCount} câu hỏi
                                </Text>
                            </View>

                            <View style={styles.expandButton}>
                                <FontAwesome5
                                    name={expandedSections.has(modalitySection.modality) ? 'times' : 'chevron-down'}
                                    size={16}
                                    color="#6B7280"
                                />
                            </View>
                        </Pressable>

                        {expandedSections.has(modalitySection.modality) && (
                            <View style={styles.testsContainer}>
                                {modalitySection.lessons.map((lesson, index) => (
                                    <Pressable
                                        key={lesson.lessonId}
                                        style={styles.testCard}
                                        onPress={() => handleTestPress(lesson.lessonId, modalitySection.modality)}
                                    >
                                        <View style={styles.testIcon}>
                                            <FontAwesome5
                                                name={getModalityIcon(lesson.items[0]?.modality || modalitySection.modality) as any}
                                                size={20}
                                                color="#3B82F6"
                                            />
                                        </View>

                                        <View style={styles.testInfo}>
                                            <Text style={styles.testTitle}>{lesson.name}</Text>
                                            <Text style={styles.testStatus}>
                                                {lesson.items.length} câu hỏi
                                            </Text>
                                        </View>

                                        <View style={styles.playButton}>
                                            <FontAwesome5 name="play" size={16} color="#3B82F6" />
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>

            <View style={{ height: 60 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    sectionsContainer: {
        padding: 16,
        gap: 12,
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    sectionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionContent: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    sectionProgress: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    expandButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    testsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },
    testCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    testIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    testInfo: {
        flex: 1,
    },
    testTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    testStatus: {
        fontSize: 14,
        color: '#6B7280',
    },
    newBadge: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    newBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
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
});