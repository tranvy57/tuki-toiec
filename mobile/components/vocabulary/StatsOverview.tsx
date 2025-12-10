import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeakVocabulary } from '~/types/vocabulary';
import { colors } from '~/constants/Color';

interface StatsOverviewProps {
  vocabularies: WeakVocabulary[];
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor?: string;
}

const StatRow: React.FC<StatRowProps> = ({ icon, label, value }) => (
  <View style={styles.statRow}>
    <View style={styles.statIcon}>{icon}</View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

export const StatsOverview: React.FC<StatsOverviewProps> = ({ vocabularies }) => {
  const totalCards = vocabularies.length;
  const markedForReview = vocabularies.filter((v) => v.isBookmarked).length;
  const dueCount = vocabularies.filter(
    (v) => v.nextReviewAt === null || (v.nextReviewAt && new Date(v.nextReviewAt) < new Date())
  ).length;

  const totalAnswered = vocabularies.reduce((acc, v) => acc + v.correctCount + v.wrongCount, 0);
  const totalCorrect = vocabularies.reduce((acc, v) => acc + v.correctCount, 0);
  const accuracy = totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : 0;

  const newWords = vocabularies.filter((v) => v.timesReviewed < 10).length;
  const moderateWords = vocabularies.filter((v) => v.strength >= 0.15).length;
  const mildWords = vocabularies.filter((v) => v.strength < 0.15 && v.strength >= 0.1).length;
  const criticalWords = vocabularies.filter((v) => v.strength < 0.1).length;

  return (
    <View style={styles.container}>
      {/* Learning Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống Kê Học Tập</Text>
        <View style={styles.statsGrid}>
          <StatRow
            icon={<MaterialCommunityIcons name="gauge" size={20} color={colors.primary} />}
            label="Tổng số Thẻ"
            value={totalCards}
          />
          <StatRow
            icon={<Feather name="book-open" size={20} color="#6366f1" />}
            label="Đã đánh dấu"
            value={markedForReview}
          />
          <StatRow
            icon={<Feather name="trending-down" size={20} color="#f97316" />}
            label="Đến Hạn"
            value={dueCount}
          />
          <StatRow
            icon={<Feather name="award" size={20} color="#22c55e" />}
            label="Độ Chính xác"
            value={`${accuracy}%`}
          />
        </View>
      </View>

      {/* Weakness Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống Kê Từ Vựng</Text>
        <View style={styles.statsGrid}>
          <StatRow
            icon={<Feather name="star" size={20} color={colors.primary} />}
            label="Từ mới"
            value={newWords}
          />
          <StatRow
            icon={<Feather name="target" size={20} color="#f97316" />}
            label="Trung bình"
            value={moderateWords}
          />
          <StatRow
            icon={<Feather name="clock" size={20} color="#eab308" />}
            label="Hơi yếu"
            value={mildWords}
          />
          <StatRow
            icon={<Feather name="trending-down" size={20} color="#ef4444" />}
            label="Rất yếu"
            value={criticalWords}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
  },
  statsGrid: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: '700',
  },
});
