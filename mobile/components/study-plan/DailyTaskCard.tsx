import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyTask } from '~/types/studyPlan';
import { StudyPlan, PlanContent } from '~/api/plans/usePlan';
import { useCurrentTask } from '~/hooks/useCurrentTask';
import { colors } from '~/constants/Color';
import { router } from 'expo-router';

interface DailyTaskCardProps {
  task: StudyTask;
  onTaskPress: (task: StudyTask) => void;
  onTaskComplete: (taskId: string) => void;
  isExpanded?: boolean;
  onContentPress?: (planId: string, phaseId: string, lessonId: string, contentId: string) => void;
  studyPlan?: StudyPlan;
}

export const DailyTaskCard: React.FC<DailyTaskCardProps> = ({
  task,
  onTaskPress,
  onTaskComplete,
  isExpanded = false,
  onContentPress,
  studyPlan,
}) => {
  const { setCurrentTask } = useCurrentTask();

  const getModeInfo = (mode: string) => {
    switch (mode) {
      case 'learn':
        return {
          icon: 'book-outline',
          color: colors.info,
          backgroundColor: `${colors.info}15`,
          text: 'Học mới',
        };
      case 'review':
        return {
          icon: 'refresh-outline',
          color: colors.warning,
          backgroundColor: `${colors.warning}15`,
          text: 'Ôn tập',
        };
      default:
        return {
          icon: 'book-outline',
          color: colors.mutedForeground,
          backgroundColor: `${colors.mutedForeground}15`,
          text: 'Học',
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: 'checkmark-circle',
          color: colors.success,
          backgroundColor: `${colors.success}15`,
          text: 'Hoàn thành',
          borderColor: colors.success,
        };
      case 'in_progress':
        return {
          icon: 'play-circle',
          color: colors.brandCoral,
          backgroundColor: `${colors.brandCoral}15`,
          text: 'Đang học',
          borderColor: colors.brandCoral,
        };
      case 'pending':
        return {
          icon: 'time-outline',
          color: colors.mutedForeground,
          backgroundColor: `${colors.mutedForeground}10`,
          text: 'Chưa bắt đầu',
          borderColor: colors.border,
        };
      default:
        return {
          icon: 'time-outline',
          color: colors.mutedForeground,
          backgroundColor: `${colors.mutedForeground}10`,
          text: 'Chưa bắt đầu',
          borderColor: colors.border,
        };
    }
  };

  const modeInfo = getModeInfo(task.mode);
  const statusInfo = getStatusInfo(task.status);

  const handleTaskPress = () => {
    onTaskPress(task);
  };

  const handleCompletePress = () => {
    if (task.status !== 'completed') {
      onTaskComplete(task.task_id);
    }
  };

  const getContentsForTask = () => {
    if (!studyPlan) return [];

    // Find the current phase
    const currentPhase = studyPlan.phases?.find((phase) => phase.status === 'current');
    if (!currentPhase) return [];

    // Find the lesson in the phase
    const phaseLesson = currentPhase.phaseLessons?.find((pl) =>
      pl.lesson.id === task.lesson.lesson_id
    );

    return phaseLesson?.lesson.contents || [];
  };

  const handleContentPress = (content: PlanContent) => {
    if (onContentPress && studyPlan) {
      const currentPhase = studyPlan.phases?.find((phase) => phase.status === 'current');

      // Find the lesson data
      const phaseLesson = currentPhase?.phaseLessons?.find((pl) =>
        pl.lesson.id === task.lesson.lesson_id
      );

      if (phaseLesson) {
        // Set current task data in the hook
        setCurrentTask(task, phaseLesson.lesson, studyPlan, task.mode);

        // Navigate to lesson detail page with content
        router.push(`/(tabs)/(study-plan)/${studyPlan.id}?phaseId=${currentPhase?.id}&lessonId=${task.lesson.lesson_id}&contentId=${content.id}`);
      }
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'strategy': return colors.info;
      case 'video': return colors.brandCoral;
      case 'quiz': return colors.warning;
      case 'explanation': return colors.success;
      case 'vocabulary': return colors.brandCoral;
      default: return colors.mutedForeground;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return 'bulb';
      case 'video': return 'play-circle';
      case 'quiz': return 'help-circle';
      case 'explanation': return 'information-circle';
      case 'vocabulary': return 'library';
      default: return 'document';
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        { borderLeftColor: statusInfo.borderColor },
        task.status === 'completed' && styles.completedContainer,
      ]}
      onPress={handleTaskPress}
    >
      <View style={styles.content}>
        {/* Left side - Status & Mode */}
        <View style={styles.leftSection}>
          <View style={[styles.statusIndicator, { backgroundColor: statusInfo.backgroundColor }]}>
            <Ionicons name={statusInfo.icon as any} size={20} color={statusInfo.color} />
          </View>

          <View style={[styles.modeIndicator, { backgroundColor: modeInfo.backgroundColor }]}>
            <Ionicons name={modeInfo.icon as any} size={14} color={modeInfo.color} />
            <Text style={[styles.modeText, { color: modeInfo.color }]}>
              {modeInfo.text}
            </Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonName, task.status === 'completed' && styles.completedText]}>
              {task.lesson.name}
            </Text>
            <Text style={[styles.lessonDescription, task.status === 'completed' && styles.completedDescription]}>
              {task.lesson.description}
            </Text>
            <Text style={styles.unitName}>{task.lesson.unit}</Text>
          </View>
        </View>

        {/* Right side - Action button */}
        <View style={styles.rightSection}>
          {task.status === 'completed' ? (
            <View style={[styles.completedBadge, { backgroundColor: statusInfo.backgroundColor }]}>
              <Ionicons name="checkmark" size={16} color={statusInfo.color} />
            </View>
          ) : (
            <Pressable
              style={[styles.actionButton, { backgroundColor: statusInfo.color }]}
              onPress={handleCompletePress}
            >
              <Ionicons
                name={task.status === 'in_progress' ? 'checkmark' : 'play'}
                size={16}
                color="white"
              />
            </Pressable>
          )}

          {/* Expansion indicator */}
          <View style={styles.expansionIndicator}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.mutedForeground}
            />
          </View>
        </View>
      </View>

      {/* Progress indicator for in_progress tasks */}
      {task.status === 'in_progress' && (
        <View style={styles.progressIndicator}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { backgroundColor: statusInfo.color }]} />
          </View>
        </View>
      )}

      {/* Expanded Contents */}
      {isExpanded && (
        <View style={styles.contentsContainer}>
          <View style={styles.contentsHeader}>
            <Text style={styles.contentsTitle}>Nội dung bài học</Text>
          </View>
          {getContentsForTask().map((content: PlanContent, index: number) => (
            <Pressable
              key={content.id}
              style={styles.contentItem}
              onPress={() => handleContentPress(content)}
            >
              <View style={styles.contentLeft}>
                <View style={[
                  styles.contentIconContainer,
                  { backgroundColor: `${getContentTypeColor(content.type)}20` }
                ]}>
                  <Ionicons
                    name={getContentTypeIcon(content.type) as any}
                    size={16}
                    color={getContentTypeColor(content.type)}
                  />
                </View>
                <View style={styles.contentInfo}>
                  <Text style={styles.contentTitle}>
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </Text>
                  <Text style={styles.contentDescription}>
                    {content.content.length > 50 ?
                      content.content.substring(0, 50) + '...' :
                      content.content
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.contentRight}>
                <Text style={styles.contentOrder}>{content.order}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 12,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  mainContent: {
    flex: 1,
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.mutedForeground,
  },
  lessonDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 6,
    lineHeight: 20,
  },
  completedDescription: {
    color: colors.mutedForeground,
    opacity: 0.7,
  },
  unitName: {
    fontSize: 12,
    color: colors.brandCoral,
    fontWeight: '500',
    backgroundColor: `${colors.brandCoral}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  rightSection: {
    alignItems: 'center',
  },
  expansionIndicator: {
    marginTop: 8,
    padding: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIndicator: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.muted,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '60%',
    borderRadius: 2,
  },
  // New styles for contents
  contentsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.muted + '20',
  },
  contentsHeader: {
    marginBottom: 12,
  },
  contentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  contentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  contentDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  contentRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentOrder: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginRight: 8,
    minWidth: 20,
    textAlign: 'center',
  },
});

