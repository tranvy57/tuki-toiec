import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyTask } from '~/types/studyPlan';
import { colors } from '~/constants/Color';

interface DailyTaskCardProps {
  task: StudyTask;
  onTaskPress: (task: StudyTask) => void;
  onTaskComplete: (taskId: number) => void;
}

export const DailyTaskCard: React.FC<DailyTaskCardProps> = ({
  task,
  onTaskPress,
  onTaskComplete,
}) => {
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
            <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
          </View>
          
          <View style={[styles.modeIndicator, { backgroundColor: modeInfo.backgroundColor }]}>
            <Ionicons name={modeInfo.icon} size={14} color={modeInfo.color} />
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
});

