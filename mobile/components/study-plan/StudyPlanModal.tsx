import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan, StudyPlanPhase } from '~/types/studyPlan';
import { colors } from '~/constants/Color';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StudyPlanModalProps {
  visible: boolean;
  onClose: () => void;
  studyPlan: StudyPlan;
}

const { width } = Dimensions.get('window');

export const StudyPlanModal: React.FC<StudyPlanModalProps> = ({ visible, onClose, studyPlan }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'in_progress':
        return colors.brandCoral;
      case 'pending':
        return colors.mutedForeground;
      default:
        return colors.mutedForeground;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in_progress':
        return 'play-circle';
      case 'pending':
        return 'time-outline';
      default:
        return 'time-outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in_progress':
        return 'Đang học';
      case 'pending':
        return 'Chưa bắt đầu';
      default:
        return 'Chưa bắt đầu';
    }
  };

  const overallProgress = Math.round(
    (studyPlan.progress.completed_tasks / studyPlan.progress.total_tasks) * 100
  );

  const remainingDays = () => {
    const startDate = new Date(studyPlan.start_date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + studyPlan.total_days);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <SafeAreaView>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Lộ Trình Học Tập</Text>
              <Text style={styles.headerSubtitle}>Chi tiết tiến độ của bạn</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Overall Progress Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Tiến Độ Tổng Quan</Text>
                <Text style={styles.progressPercentage}>{overallProgress}%</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
                </View>
              </View>

              <View style={styles.progressStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{studyPlan.progress.completed_tasks}</Text>
                  <Text style={styles.statLabel}>Hoàn thành</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{studyPlan.progress.total_tasks}</Text>
                  <Text style={styles.statLabel}>Tổng bài</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{remainingDays()}</Text>
                  <Text style={styles.statLabel}>Ngày còn lại</Text>
                </View>
              </View>
            </View>

            {/* Target Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="trophy-outline" size={20} color={colors.brandCoral} />
                  <Text style={styles.infoLabel}>Mục tiêu điểm</Text>
                  <Text style={styles.infoValue}>{studyPlan.target_score}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={20} color={colors.info} />
                  <Text style={styles.infoLabel}>Ngày bắt đầu</Text>
                  <Text style={styles.infoValue}>{formatDate(studyPlan.start_date)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={20} color={colors.success} />
                  <Text style={styles.infoLabel}>Thời gian học</Text>
                  <Text style={styles.infoValue}>{studyPlan.total_days} ngày</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="person-outline" size={20} color={colors.warning} />
                  <Text style={styles.infoLabel}>ID người dùng</Text>
                  <Text style={styles.infoValue}>#{studyPlan.user_id}</Text>
                </View>
              </View>
            </View>

            {/* Phases */}
            <View style={styles.phasesContainer}>
              <Text style={styles.sectionTitle}>Các Giai Đoạn Học Tập</Text>

              {studyPlan.phases.map((phase, index) => (
                <View key={phase.phase_id} style={styles.phaseCard}>
                  <View style={styles.phaseHeader}>
                    <View style={styles.phaseInfo}>
                      <View style={styles.phaseIconContainer}>
                        <Ionicons
                          name={getStatusIcon(phase.status)}
                          size={20}
                          color={getStatusColor(phase.status)}
                        />
                      </View>
                      <View style={styles.phaseTitleContainer}>
                        <Text style={styles.phaseTitle}>{phase.title}</Text>
                        <Text style={[styles.phaseStatus, { color: getStatusColor(phase.status) }]}>
                          {getStatusText(phase.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.phaseProgress}>{phase.progress}%</Text>
                  </View>

                  <View style={styles.phaseProgressBarContainer}>
                    <View style={styles.phaseProgressBar}>
                      <View
                        style={[
                          styles.phaseProgressBarFill,
                          {
                            width: `${phase.progress}%`,
                            backgroundColor: getStatusColor(phase.status),
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.muted,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.brandCoral,
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
    backgroundColor: colors.brandCoral,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  phasesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 16,
  },
  phaseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phaseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseTitleContainer: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  phaseStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  phaseProgress: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  phaseProgressBarContainer: {
    marginTop: 8,
  },
  phaseProgressBar: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  phaseProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
