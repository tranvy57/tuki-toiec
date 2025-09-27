import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailySummary } from '~/types/studyPlan';
import { colors } from '~/constants/Color';

interface TaskSummaryProps {
  summary: DailySummary;
  date: string;
}

export const TaskSummary: React.FC<TaskSummaryProps> = ({ summary, date }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Hôm nay';
    if (isYesterday) return 'Hôm qua';
    if (isTomorrow) return 'Ngày mai';

    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return colors.success;
    if (progress >= 50) return colors.brandCoral;
    if (progress > 0) return colors.warning;
    return colors.mutedForeground;
  };

  const getProgressIcon = (progress: number) => {
    if (progress === 100) return 'checkmark-circle';
    if (progress > 0) return 'play-circle';
    return 'time-outline';
  };

  const progressColor = getProgressColor(summary.progress);
  const progressIcon = getProgressIcon(summary.progress);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <Text style={styles.dateSubtext}>
            {new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </View>
        
        <View style={styles.progressSection}>
          <View style={[styles.progressIcon, { backgroundColor: `${progressColor}15` }]}>
            <Ionicons name={progressIcon} size={24} color={progressColor} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Tiến độ hôm nay: {summary.completed}/{summary.total} bài
          </Text>
          <Text style={[styles.progressPercentage, { color: progressColor }]}>
            {summary.progress}%
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                { 
                  width: `${summary.progress}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.success}15` }]}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            </View>
            <Text style={styles.statNumber}>{summary.completed}</Text>
            <Text style={styles.statLabel}>Hoàn thành</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.mutedForeground}15` }]}>
              <Ionicons name="list-outline" size={16} color={colors.mutedForeground} />
            </View>
            <Text style={styles.statNumber}>{summary.total - summary.completed}</Text>
            <Text style={styles.statLabel}>Còn lại</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.info}15` }]}>
              <Ionicons name="target-outline" size={16} color={colors.info} />
            </View>
            <Text style={styles.statNumber}>{summary.total}</Text>
            <Text style={styles.statLabel}>Tổng cộng</Text>
          </View>
        </View>
      </View>

      {summary.progress === 100 && (
        <View style={styles.celebrationBanner}>
          <Ionicons name="trophy" size={20} color={colors.warning} />
          <Text style={styles.celebrationText}>
            🎉 Chúc mừng! Bạn đã hoàn thành tất cả bài học hôm nay!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateSection: {
    flex: 1,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  progressSection: {
    alignItems: 'center',
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  celebrationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.warning}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  celebrationText: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
    marginLeft: 8,
  },
});

