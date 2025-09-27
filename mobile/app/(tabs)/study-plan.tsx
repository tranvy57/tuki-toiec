import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { StudyHeader } from '~/components/study-plan/StudyHeader';
import { StudyPlanModal } from '~/components/study-plan/StudyPlanModal';
import { TaskSummary } from '~/components/study-plan/TaskSummary';
import { DailyTaskCard } from '~/components/study-plan/DailyTaskCard';
import TabScene from '~/components/TabScene';
import { DailyStudy, StudyTask, StudyPlan as StudyPlanType } from '~/types/studyPlan';
import { colors } from '~/constants/Color';

// Sample data for daily study tasks
const sampleDailyStudy: DailyStudy = {
  date: "2025-09-27",
  plan_id: 1,
  user_id: 101,
  summary: {
    completed: 1,
    total: 3,
    progress: 33
  },
  tasks: [
    {
      task_id: 301,
      mode: "learn",
      status: "in_progress",
      lesson: {
        lesson_id: 101,
        name: "Present Simple Tense",
        description: "Ôn tập thì hiện tại đơn",
        unit: "Grammar Basics"
      },
      content_url: "/lessons/101/content"
    },
    {
      task_id: 302,
      mode: "review",
      status: "pending",
      lesson: {
        lesson_id: 102,
        name: "Past Simple Tense",
        description: "Ôn tập thì quá khứ đơn",
        unit: "Grammar Basics"
      },
      content_url: "/lessons/102/review"
    },
    {
      task_id: 303,
      mode: "review",
      status: "completed",
      lesson: {
        lesson_id: 201,
        name: "Vocabulary: Daily Life",
        description: "Từ vựng giao tiếp hằng ngày",
        unit: "Vocabulary Unit 1"
      },
      content_url: "/lessons/201/review"
    }
  ]
};

// Sample data for the study plan modal
const sampleStudyPlan: StudyPlanType = {
  plan_id: 1,
  user_id: 101,
  target_score: 700,
  start_date: "2025-09-01",
  total_days: 60,
  progress: {
    completed_tasks: 12,
    total_tasks: 120
  },
  phases: [
    { phase_id: 1, title: "Grammar Foundation", status: "in_progress", progress: 40 },
    { phase_id: 2, title: "Listening Part 1-2", status: "pending", progress: 0 },
    { phase_id: 3, title: "Reading Practice", status: "pending", progress: 0 }
  ]
};

export default function StudyPlan() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dailyStudy, setDailyStudy] = useState<DailyStudy>(sampleDailyStudy);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleTaskPress = (task: StudyTask) => {
    console.log('Task pressed:', task);
    // Navigate to lesson content
    // router.push(`/lessons/${task.lesson.lesson_id}`);
  };

  const handleTaskComplete = (taskId: number) => {
    setDailyStudy(prev => {
      const updatedTasks = prev.tasks.map(task => {
        if (task.task_id === taskId) {
          return { ...task, status: 'completed' as const };
        }
        return task;
      });

      const completedCount = updatedTasks.filter(task => task.status === 'completed').length;
      const progress = Math.round((completedCount / updatedTasks.length) * 100);

      return {
        ...prev,
        tasks: updatedTasks,
        summary: {
          ...prev.summary,
          completed: completedCount,
          progress,
        },
      };
    });
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
          <TaskSummary 
            summary={dailyStudy.summary} 
            date={dailyStudy.date} 
          />

          {/* Task List */}
          <View style={styles.tasksList}>
            {dailyStudy.tasks.map((task) => (
              <DailyTaskCard
                key={task.task_id}
                task={task}
                onTaskPress={handleTaskPress}
                onTaskComplete={handleTaskComplete}
              />
            ))}
          </View>
        </ScrollView>

        <StudyPlanModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          studyPlan={sampleStudyPlan}
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
});
