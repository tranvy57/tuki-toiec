import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/Color';

interface VocabularyStatsProps {
  totalWords: number;
  learnedWords: number;
  todayWords: number;
  weekStreak: number;
}

export const VocabularyStats: React.FC<VocabularyStatsProps> = ({
  totalWords,
  learnedWords,
  todayWords,
  weekStreak
}) => {
  const progressPercentage = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;

  const stats = [
    {
      id: 'total',
      value: totalWords,
      label: 'Total Words',
      icon: 'library-outline',
      color: colors.primary,
      backgroundColor: colors.brandCoral50,
    },
    {
      id: 'learned',
      value: learnedWords,
      label: 'Learned',
      icon: 'checkmark-circle-outline',
      color: colors.success,
      backgroundColor: colors.successLight + '20',
    },
    {
      id: 'today',
      value: todayWords,
      label: 'Today',
      icon: 'today-outline',
      color: colors.info,
      backgroundColor: colors.infoLight + '20',
    },
    {
      id: 'streak',
      value: weekStreak,
      label: 'Week Streak',
      icon: 'flame-outline',
      color: colors.warning,
      backgroundColor: colors.warningLight + '20',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {learnedWords} of {totalWords} words learned
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.backgroundColor }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    fontWeight: '500',
  },
});

