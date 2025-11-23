import React from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Pressable,
    ScrollView,
    Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '~/constants/Color'
import { useSpeakingHistory, SpeakingHistoryStore } from '~/store/speakingHistory'

const { width } = Dimensions.get('window')

interface SpeakingHistoryDialogProps {
    visible: boolean
    onClose: () => void
    skillFilter?: string // Optional filter for specific skill
}

export const SpeakingHistoryDialog: React.FC<SpeakingHistoryDialogProps> = ({
    visible,
    onClose,
    skillFilter,
}) => {
    const {
        attempts,
        selectedAttempt,
        isDetailDialogVisible,
        showDetailDialog,
        hideDetailDialog,
    } = useSpeakingHistory()

    // Filter attempts by skill if specified
    const filteredAttempts = skillFilter
        ? attempts.filter((attempt) => attempt.skill === skillFilter)
        : attempts

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date))
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return colors.success
            case 'in-progress':
                return colors.warning
            case 'failed':
                return colors.error
            default:
                return colors.gray
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành'
            case 'in-progress':
                return 'Đang thực hiện'
            case 'failed':
                return 'Thất bại'
            default:
                return 'Chưa xác định'
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return colors.success
        if (score >= 60) return colors.warning
        return colors.error
    }

    return (
        <>
            {/* History Dialog */}
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerTitle}>Lịch Sử Luyện Tập</Text>
                            <Text style={styles.headerSubtitle}>
                                {skillFilter
                                    ? `Kỹ năng: ${skillFilter}`
                                    : 'Tất cả lịch sử speaking'}
                            </Text>
                        </View>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.foreground} />
                        </Pressable>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {filteredAttempts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="mic-off" size={64} color={colors.gray} />
                                <Text style={styles.emptyTitle}>Chưa có lịch sử</Text>
                                <Text style={styles.emptyDescription}>
                                    Bạn chưa có bài luyện tập speaking nào. Hãy bắt đầu luyện tập để
                                    xem lịch sử tại đây.
                                </Text>
                            </View>
                        ) : (
                            <>
                                {/* Summary Stats */}
                                <View style={styles.statsCard}>
                                    <View style={styles.statsHeader}>
                                        <Text style={styles.statsTitle}>Thống Kê</Text>
                                    </View>
                                    <View style={styles.statsGrid}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statNumber}>
                                                {filteredAttempts.length}
                                            </Text>
                                            <Text style={styles.statLabel}>Tổng bài</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statNumber}>
                                                {filteredAttempts.filter(a => a.status === 'completed').length}
                                            </Text>
                                            <Text style={styles.statLabel}>Hoàn thành</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={[styles.statNumber, { color: colors.success }]}>
                                                {filteredAttempts.length > 0
                                                    ? Math.round(
                                                        filteredAttempts
                                                            .filter(a => a.status === 'completed')
                                                            .reduce((acc, a) => acc + a.score, 0) /
                                                        filteredAttempts.filter(a => a.status === 'completed').length || 1
                                                    )
                                                    : 0}
                                            </Text>
                                            <Text style={styles.statLabel}>Điểm TB</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Attempts List */}
                                <View style={styles.attemptsSection}>
                                    <Text style={styles.sectionTitle}>Lịch Sử Bài Tập</Text>
                                    {filteredAttempts.map((attempt) => (
                                        <Pressable
                                            key={attempt.id}
                                            style={styles.attemptCard}
                                            onPress={() => showDetailDialog(attempt)}
                                        >
                                            <View style={styles.attemptHeader}>
                                                <View style={styles.attemptInfo}>
                                                    <Text style={styles.attemptSkill}>{attempt.skill}</Text>
                                                    <Text style={styles.attemptDate}>
                                                        {formatDate(attempt.attemptDate)}
                                                    </Text>
                                                </View>
                                                <View style={styles.attemptMeta}>
                                                    <View
                                                        style={[
                                                            styles.statusBadge,
                                                            { backgroundColor: getStatusColor(attempt.status) },
                                                        ]}
                                                    >
                                                        <Text style={styles.statusText}>
                                                            {getStatusText(attempt.status)}
                                                        </Text>
                                                    </View>
                                                    <Ionicons
                                                        name="chevron-forward"
                                                        size={16}
                                                        color={colors.gray}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.attemptDetails}>
                                                <Text style={styles.attemptTask}>
                                                    {attempt.details.taskType}
                                                </Text>
                                                <View style={styles.attemptMetrics}>
                                                    <View style={styles.metric}>
                                                        <Ionicons name="time" size={14} color={colors.gray} />
                                                        <Text style={styles.metricText}>
                                                            {formatDuration(attempt.duration)}
                                                        </Text>
                                                    </View>
                                                    {attempt.status === 'completed' && (
                                                        <View style={styles.metric}>
                                                            <Ionicons name="star" size={14} color={colors.gray} />
                                                            <Text
                                                                style={[
                                                                    styles.metricText,
                                                                    { color: getScoreColor(attempt.score) },
                                                                ]}
                                                            >
                                                                {attempt.score}%
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            {/* Detail Dialog */}
            {selectedAttempt && (
                <Modal
                    visible={isDetailDialogVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={hideDetailDialog}
                >
                    <View style={styles.detailOverlay}>
                        <View style={styles.detailDialog}>
                            <View style={styles.detailHeader}>
                                <Text style={styles.detailTitle}>Chi Tiết Bài Tập</Text>
                                <Pressable onPress={hideDetailDialog}>
                                    <Ionicons name="close" size={24} color={colors.foreground} />
                                </Pressable>
                            </View>

                            <ScrollView style={styles.detailContent}>
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Thông Tin Chung</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Kỹ năng:</Text>
                                        <Text style={styles.detailValue}>{selectedAttempt.skill}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Loại bài:</Text>
                                        <Text style={styles.detailValue}>
                                            {selectedAttempt.details.taskType}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Thời gian:</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDate(selectedAttempt.attemptDate)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Thời lượng:</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDuration(selectedAttempt.duration)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Kết Quả</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Trạng thái:</Text>
                                        <Text
                                            style={[
                                                styles.detailValue,
                                                { color: getStatusColor(selectedAttempt.status) },
                                            ]}
                                        >
                                            {getStatusText(selectedAttempt.status)}
                                        </Text>
                                    </View>
                                    {selectedAttempt.status === 'completed' && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Điểm số:</Text>
                                            <Text
                                                style={[
                                                    styles.detailValue,
                                                    { color: getScoreColor(selectedAttempt.score) },
                                                    styles.scoreText,
                                                ]}
                                            >
                                                {selectedAttempt.score}%
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Câu Hỏi</Text>
                                    <Text style={styles.questionText}>
                                        {selectedAttempt.details.question}
                                    </Text>
                                </View>

                                {selectedAttempt.details.transcription && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Nội Dung Ghi Âm</Text>
                                        <Text style={styles.transcriptionText}>
                                            {selectedAttempt.details.transcription}
                                        </Text>
                                    </View>
                                )}

                                {selectedAttempt.details.feedback && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Nhận Xét</Text>
                                        <Text style={styles.feedbackText}>
                                            {selectedAttempt.details.feedback}
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.foreground,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.muted,
        marginTop: 2,
    },
    closeButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.secondary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
        marginTop: 16,
    },
    emptyDescription: {
        fontSize: 14,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    statsCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statsHeader: {
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },
    attemptsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 12,
    },
    attemptCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    attemptHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    attemptInfo: {
        flex: 1,
    },
    attemptSkill: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    attemptDate: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
    },
    attemptMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.white,
    },
    attemptDetails: {
        gap: 8,
    },
    attemptTask: {
        fontSize: 14,
        color: colors.foreground,
        fontWeight: '500',
    },
    attemptMetrics: {
        flexDirection: 'row',
        gap: 16,
    },
    metric: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metricText: {
        fontSize: 12,
        color: colors.muted,
    },
    // Detail Dialog Styles
    detailOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailDialog: {
        backgroundColor: colors.background,
        borderRadius: 16,
        width: width * 0.9,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.foreground,
    },
    detailContent: {
        maxHeight: '100%',
    },
    detailSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    detailSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: colors.muted,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: colors.foreground,
        fontWeight: '500',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '700',
    },
    questionText: {
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
    },
    transcriptionText: {
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
        fontStyle: 'italic',
        backgroundColor: colors.secondary,
        padding: 12,
        borderRadius: 8,
    },
    feedbackText: {
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 20,
        backgroundColor: colors.secondary,
        padding: 12,
        borderRadius: 8,
    },
})