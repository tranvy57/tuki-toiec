import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyPlan, StudyPlanPhase } from '~/types/studyPlan';
import { StudyPlan as ApiStudyPlan, useMyPlan, useLatestCourse } from '~/api/plans/usePlan';
import { colors } from '~/constants/Color';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StudyPlanModalProps {
  visible: boolean;
  onClose: () => void;
  studyPlan: StudyPlan;
  onContentPress?: (planId: string, phaseId: string, lessonId: string, contentId: string) => void;
}

const { width } = Dimensions.get('window');

export const StudyPlanModal: React.FC<StudyPlanModalProps> = ({ visible, onClose, studyPlan, onContentPress }) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const { data: myPlan } = useMyPlan();
  const { data: latestCourse } = useLatestCourse();

  // Use myPlan if available, otherwise fallback to latestCourse
  const apiStudyPlan = latestCourse;

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'play-circle';
      case 'quiz':
        return 'help-circle';
      case 'vocabulary':
        return 'book';
      case 'strategy':
        return 'bulb';
      case 'explanation':
        return 'document-text';
      default:
        return 'document';
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return colors.brandCoral;
      case 'quiz':
        return colors.success;
      case 'vocabulary':
        return '#3B82F6'; // blue
      case 'strategy':
        return '#F59E0B'; // amber
      case 'explanation':
        return colors.mutedForeground;
      default:
        return colors.foreground;
    }
  };

  const getContentTypeName = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'quiz':
        return 'Bài tập';
      case 'vocabulary':
        return 'Từ vựng';
      case 'strategy':
        return 'Chiến lược';
      case 'explanation':
        return 'Giải thích';
      default:
        return 'Nội dung';
    }
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };
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

  // console.log(studyPlan.phases)

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

            {/* Chapters/Phases */}
            <View style={styles.chaptersContainer}>
              <Text style={styles.sectionTitle}>Chương học</Text>

              {studyPlan.phases?.map((phase, index) => (
                <View key={phase.id} style={styles.chapterCard}>
                  {/* Chapter Header */}
                  <Pressable
                    style={styles.chapterHeader}
                    onPress={() => togglePhase(phase.id)}
                  >
                    <View style={styles.chapterLeft}>
                      <View style={styles.chapterIconContainer}>
                        <Ionicons
                          name="play-circle"
                          size={24}
                          color={getStatusColor(phase.status)}
                        />
                      </View>
                      <View style={styles.chapterInfo}>
                        <Text style={styles.chapterTitle}>{phase.title}</Text>
                        <Text style={styles.chapterSubtitle}>
                          {getStatusText(phase.status)}
                        </Text>
                        <Text style={styles.chapterLessons}>
                          {(() => {
                            const apiPhase = apiStudyPlan?.phases?.find(p => p.id === phase.id.toString());
                            const lessonCount = apiPhase?.phaseLessons.length || 0;
                            return `${lessonCount} bài học`;
                          })()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.chapterRight}>
                      <View style={styles.chapterStatus}>
                        <Text style={[styles.chapterStatusText, { color: getStatusColor(phase.status) }]}>
                          {getStatusText(phase.status)}
                        </Text>
                      </View>
                      <Ionicons
                        name={expandedPhases.has(phase.id) ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.mutedForeground}
                      />
                    </View>
                  </Pressable>

                  {/* Chapter Progress Bar */}
                  <View style={styles.chapterProgressContainer}>
                    <View style={styles.chapterProgressBar}>
                      <View
                        style={[
                          styles.chapterProgressBarFill,
                          {
                            width: `${phase.progress}%`,
                            backgroundColor: getStatusColor(phase.status),
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Expanded Lessons */}
                  {apiStudyPlan && expandedPhases.has(phase.id) && (
                    <View style={styles.lessonsContainer}>
                      {(() => {
                        const apiPhase = apiStudyPlan.phases?.find(p => p.id === phase.id.toString());
                        if (!apiPhase) return null;

                        return apiPhase.phaseLessons
                          .sort((a, b) => a.order - b.order)
                          .map((phaseLesson, lessonIndex) => (
                            <View key={phaseLesson.lesson.id}>
                              {/* Lesson Header */}
                              <Pressable
                                style={styles.lessonItem}
                                onPress={() => toggleLesson(phaseLesson.lesson.id)}
                              >
                                <View style={styles.lessonLeft}>
                                  <View style={styles.lessonIconContainer}>
                                    <Ionicons
                                      name={phaseLesson.lesson.studyTaskStatus === 'completed' ? "checkmark-circle" :
                                        phaseLesson.lesson.studyTaskStatus === 'in_progress' ? "play-circle" : "radio-button-off"}
                                      size={20}
                                      color={getStatusColor(phaseLesson.lesson.studyTaskStatus)}
                                    />
                                  </View>
                                  <View style={styles.lessonInfo}>
                                    <Text style={styles.lessonTitle}>{phaseLesson.lesson.name}</Text>
                                    <Text style={styles.lessonSubtitle}>
                                      {phaseLesson.lesson.description} • {phaseLesson.lesson.contents?.length || 0} nội dung
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.lessonRight}>
                                  <Text style={styles.lessonNumber}>{lessonIndex + 1}</Text>
                                  <Ionicons
                                    name={expandedLessons.has(phaseLesson.lesson.id) ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={colors.mutedForeground}
                                  />
                                </View>
                              </Pressable>

                              {/* Expanded Contents */}
                              {expandedLessons.has(phaseLesson.lesson.id) && (
                                <View style={styles.contentsContainer}>
                                  {phaseLesson.lesson.contents
                                    ?.sort((a: any, b: any) => a.order - b.order)
                                    ?.map((content: any, contentIndex: number) => (
                                      <Pressable
                                        key={content.id}
                                        style={styles.contentItem}
                                        onPress={() => onContentPress?.(
                                          apiStudyPlan.id,
                                          apiPhase.id,
                                          phaseLesson.lesson.id,
                                          content.id
                                        )}
                                      >
                                        <View style={styles.contentLeft}>
                                          <View style={[
                                            styles.contentIconContainer,
                                            { backgroundColor: `${getContentTypeColor(content.type)}20` }
                                          ]}>
                                            <Ionicons
                                              name={getContentTypeIcon(content.type) as any}
                                              size={14}
                                              color={getContentTypeColor(content.type)}
                                            />
                                          </View>
                                          <View style={styles.contentInfo}>
                                            <Text style={styles.contentTitle}>
                                              {content.content || `${getContentTypeName(content.type)} ${contentIndex + 1}`}
                                            </Text>
                                            <Text style={styles.contentSubtitle}>
                                              {getContentTypeName(content.type)}
                                            </Text>
                                          </View>
                                        </View>

                                        <View style={styles.contentRight}>
                                          <Text style={styles.contentNumber}>{contentIndex + 1}</Text>
                                          <Ionicons
                                            name="chevron-forward"
                                            size={14}
                                            color={colors.mutedForeground}
                                          />
                                        </View>
                                      </Pressable>
                                    ))}
                                </View>
                              )}
                            </View>
                          ));
                      })()}
                    </View>
                  )}
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
  chaptersContainer: {
    marginBottom: 20,
  },
  chapterCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chapterIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  chapterSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 2,
  },
  chapterLessons: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  chapterRight: {
    alignItems: 'flex-end',
  },
  chapterStatus: {
    backgroundColor: colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  chapterStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chapterProgressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chapterProgressBar: {
    height: 4,
    backgroundColor: colors.muted,
    borderRadius: 2,
    overflow: 'hidden',
  },
  chapterProgressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  lessonsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fafafa',
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  lessonSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  lessonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
    marginRight: 8,
    backgroundColor: colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    textAlign: 'center',
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
  contentsContainer: {
    backgroundColor: '#f8f9fa',
    paddingLeft: 16,
  },
  contentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  contentSubtitle: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  contentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contentNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedForeground,
    backgroundColor: colors.muted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
  },
});
