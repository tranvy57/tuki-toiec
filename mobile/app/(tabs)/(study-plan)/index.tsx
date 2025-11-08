import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { StudyHeader } from '~/components/study-plan/StudyHeader';
import { StudyPlanModal } from '~/components/study-plan/StudyPlanModal';
import { TaskSummary } from '~/components/study-plan/TaskSummary';
import { DailyTaskCard } from '~/components/study-plan/DailyTaskCard';
import TabScene from '~/components/TabScene';
import { DailyStudy, StudyTask, StudyPlan as StudyPlanType } from '~/types/studyPlan';
import { useMyPlan, useLatestCourse, StudyPlan } from '~/api/plans/usePlan';
import { useCurrentTask } from '~/hooks/useCurrentTask';
import { colors } from '~/constants/Color';
import { router } from 'expo-router';

export default function StudyPlanScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    const { data: myPlan, isLoading: planLoading, error: planError } = useMyPlan();
    const { data: latestCourse, isLoading: courseLoading, error: courseError } = useLatestCourse();

    const isLoading = planLoading || courseLoading;
    const error = planError || courseError;

    const studyPlan: StudyPlan | null = latestCourse || null;

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleTaskPress = (task: StudyTask) => {
        console.log('Task pressed:', task);
        // Toggle expansion of the task to show/hide contents
        setExpandedTasks(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(task.task_id)) {
                newExpanded.delete(task.task_id);
            } else {
                newExpanded.add(task.task_id);
            }
            return newExpanded;
        });
    };

    const handleContentPress = (planId: string, phaseId: string, lessonId: string, contentId: string) => {
        router.push(`/(tabs)/(study-plan)/${planId}?phaseId=${phaseId}&lessonId=${lessonId}&contentId=${contentId}`);
    };

    // Show loading state
    if (isLoading) {
        return (
            <TabScene>
                <View style={[styles.container, styles.centerContent]}>
                    <ActivityIndicator size="large" color={colors.brandCoral} />
                    <Text style={styles.loadingText}>Đang tải kế hoạch học tập...</Text>
                </View>
            </TabScene>
        );
    }

    // Show error state
    if (error) {
        return (
            <TabScene>
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.errorText}>Không thể tải kế hoạch học tập</Text>
                    <Text style={styles.errorSubtext}>Vui lòng thử lại sau</Text>
                </View>
            </TabScene>
        );
    }

    // Show no plan state
    if (!studyPlan) {
        return (
            <TabScene>
                <View style={[styles.container, styles.centerContent]}>
                    <Text style={styles.noPlanText}>Không có khóa học nào</Text>
                    <Text style={styles.noPlanSubtext}>Vui lòng thử lại sau</Text>
                </View>
            </TabScene>
        );
    }

    console.log("Study Plan Phases:", studyPlan?.phases);

    // Transform plan data to match existing interface
    const transformedStudyPlan: StudyPlanType = {
        plan_id: studyPlan?.id || '',
        target_score: (studyPlan?.band || 0) * 100, // Convert band to score
        start_date: studyPlan?.createdAt || '',
        total_days: studyPlan?.durationDays || 0,
        progress: {
            completed_tasks: studyPlan?.phases?.reduce((total, phase) =>
                total + phase.phaseLessons.filter(pl =>
                    pl.lesson.studyTaskStatus === 'completed'
                ).length, 0
            ) || 0,
            total_tasks: studyPlan?.phases?.reduce((total, phase) =>
                total + phase.phaseLessons.length, 0
            ) || 0
        },
        phases: studyPlan?.phases?.map(phase => ({
            id: phase.id,
            title: phase.title,
            status: phase.status === 'current' ? 'in_progress' :
                phase.status === 'locked' ? 'pending' : phase.status,
            progress: Math.round(
                (phase.phaseLessons.filter(pl => pl.lesson.studyTaskStatus === 'completed').length /
                    phase.phaseLessons.length) * 100
            ) || 0
        })) || []
    };

    // Generate daily tasks from current phase
    const currentPhase = studyPlan?.phases?.find(phase => phase.status === 'current');
    const todayTasks: StudyTask[] = currentPhase ?
        currentPhase.phaseLessons
            .filter(pl => pl.lesson.studyTaskStatus !== 'locked')
            .slice(0, 3) // Show first 3 lessons as today's tasks
            .map(phaseLesson => ({
                task_id: phaseLesson.lesson.id,
                mode: phaseLesson.lesson.studyTaskStatus === 'completed' ? 'review' : 'learn',
                status: phaseLesson.lesson.studyTaskStatus === 'pending' ? 'pending' :
                    phaseLesson.lesson.studyTaskStatus === 'completed' ? 'completed' : 'in_progress',
                lesson: {
                    lesson_id: phaseLesson.lesson.id,
                    name: phaseLesson.lesson.name,
                    description: phaseLesson.lesson.description,
                    unit: currentPhase.title
                },
                content_url: `/lessons/${phaseLesson.lesson.id}/content`
            }))
        : [];

    const dailyStudy: DailyStudy = {
        date: new Date().toISOString().split('T')[0],
        plan_id: studyPlan?.id || '',
        user_id: '0',
        summary: {
            completed: todayTasks.filter(task => task.status === 'completed').length,
            total: todayTasks.length,
            progress: todayTasks.length > 0 ?
                Math.round((todayTasks.filter(task => task.status === 'completed').length / todayTasks.length) * 100) : 0
        },
        tasks: todayTasks
    };

    const handleTaskComplete = (taskId: string) => {
        // This would typically call an API to update task status
        console.log('Task completed:', taskId);
    };

    return (
        <TabScene>
            <View style={styles.container}>
                <StudyHeader onProgressPress={handleOpenModal} />

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Task Summary */}
                    {/* <TaskSummary
                        summary={dailyStudy.summary}
                        date={dailyStudy.date}
                    /> */}

                    {/* Task List */}
                    <View style={styles.tasksList}>
                        {dailyStudy.tasks?.map((task) => (
                            <DailyTaskCard
                                key={task.task_id}
                                task={task}
                                onTaskPress={handleTaskPress}
                                onTaskComplete={handleTaskComplete}
                                isExpanded={expandedTasks.has(task.task_id)}
                                onContentPress={handleContentPress}
                                studyPlan={studyPlan}
                            />
                        ))}
                    </View>
                </ScrollView>

                <StudyPlanModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                    studyPlan={transformedStudyPlan}
                    onContentPress={handleContentPress}
                />
            </View>
        </TabScene>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    tasksList: {
        flex: 1,
    },
    centerContent: {
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
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 14,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
    noPlanText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
        textAlign: 'center',
        marginBottom: 8,
    },
    noPlanSubtext: {
        fontSize: 14,
        color: colors.mutedForeground,
        textAlign: 'center',
    },
});
