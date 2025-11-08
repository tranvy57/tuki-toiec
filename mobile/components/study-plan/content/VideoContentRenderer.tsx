import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoContent, ContentProgress, VideoChapter } from '~/types/contentTypes';
import { colors } from '~/constants/Color';

interface VideoContentRendererProps {
    content: VideoContent;
    progress?: ContentProgress;
    onComplete: (score?: number) => void;
    onProgress: (progress: Partial<ContentProgress>) => void;
    isPreview?: boolean;
}

export const VideoContentRenderer: React.FC<VideoContentRendererProps> = ({
    content,
    progress,
    onComplete,
    onProgress,
    isPreview = false,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(progress?.currentPosition || 0);
    const [duration, setDuration] = useState(content.duration ? content.duration * 60 : 0); // Convert minutes to seconds
    const [showTranscript, setShowTranscript] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (isPreview) {
            Alert.alert('Xem trước', 'Vui lòng bắt đầu bài học để xem video');
            return;
        }
        setIsPlaying(!isPlaying);
        onProgress({
            startedAt: progress?.startedAt || new Date().toISOString(),
            currentPosition: currentTime
        });
    };

    const handleChapterPress = (chapter: VideoChapter) => {
        if (isPreview) return;

        setSelectedChapter(chapter.id);
        setCurrentTime(chapter.startTime);
        onProgress({ currentPosition: chapter.startTime });
    };

    const handleVideoComplete = () => {
        setIsPlaying(false);
        setCurrentTime(duration);
        onProgress({
            isCompleted: true,
            completedAt: new Date().toISOString(),
            currentPosition: duration
        });
        onComplete(100);
    };

    const getProgress = () => {
        if (duration === 0) return 0;
        return (currentTime / duration) * 100;
    };

    const getCurrentChapter = () => {
        if (!content.chapters) return null;
        return content.chapters.find(chapter =>
            currentTime >= chapter.startTime && currentTime <= chapter.endTime
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Video Player Section */}
            <View style={styles.videoContainer}>
                {/* Video Placeholder/Thumbnail */}
                <View style={styles.videoPlayer}>
                    {content.thumbnailUrl ? (
                        <View style={styles.thumbnail}>
                            {/* In a real app, you would use an Image component or video player here */}
                            <Text style={styles.thumbnailText}>Video Thumbnail</Text>
                        </View>
                    ) : (
                        <View style={styles.videoPlaceholder}>
                            <Ionicons name="videocam" size={48} color={colors.mutedForeground} />
                            <Text style={styles.videoPlaceholderText}>Video Player</Text>
                        </View>
                    )}

                    {/* Play/Pause Button Overlay */}
                    <Pressable style={styles.playButton} onPress={handlePlayPause}>
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={32}
                            color="white"
                        />
                    </Pressable>
                </View>

                {/* Video Controls */}
                <View style={styles.controls}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
                        </View>
                        <Text style={styles.timeText}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                    </View>

                    {/* Control Buttons */}
                    <View style={styles.controlButtons}>
                        <Pressable style={styles.controlButton}>
                            <Ionicons name="play-back" size={20} color={colors.foreground} />
                        </Pressable>
                        <Pressable style={styles.controlButton} onPress={handlePlayPause}>
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={24}
                                color={colors.foreground}
                            />
                        </Pressable>
                        <Pressable style={styles.controlButton}>
                            <Ionicons name="play-forward" size={20} color={colors.foreground} />
                        </Pressable>
                        <View style={styles.spacer} />
                        <Pressable
                            style={styles.controlButton}
                            onPress={() => setShowTranscript(!showTranscript)}
                        >
                            <Ionicons name="document-text" size={20} color={colors.foreground} />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Video Info */}
            <View style={styles.infoSection}>
                <Text style={styles.title}>{content.title}</Text>
                <Text style={styles.description}>{content.content}</Text>

                {content.duration && (
                    <View style={styles.metadata}>
                        <Ionicons name="time" size={16} color={colors.mutedForeground} />
                        <Text style={styles.metadataText}>{content.duration} phút</Text>
                    </View>
                )}
            </View>

            {/* Chapters */}
            {content.chapters && content.chapters.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chương</Text>
                    {content.chapters.map((chapter, index) => (
                        <Pressable
                            key={chapter.id}
                            style={[
                                styles.chapterItem,
                                selectedChapter === chapter.id && styles.selectedChapter
                            ]}
                            onPress={() => handleChapterPress(chapter)}
                        >
                            <View style={styles.chapterNumber}>
                                <Text style={styles.chapterNumberText}>{index + 1}</Text>
                            </View>
                            <View style={styles.chapterContent}>
                                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                                <Text style={styles.chapterTime}>
                                    {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                                </Text>
                            </View>
                            <Ionicons name="play" size={16} color={colors.mutedForeground} />
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Transcript */}
            {showTranscript && content.transcript && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Phụ đề</Text>
                        <Pressable onPress={() => setShowTranscript(false)}>
                            <Ionicons name="close" size={20} color={colors.mutedForeground} />
                        </Pressable>
                    </View>
                    <View style={styles.transcriptContainer}>
                        <Text style={styles.transcriptText}>{content.transcript}</Text>
                    </View>
                </View>
            )}

            {/* Complete Button */}
            {!isPreview && getProgress() >= 80 && (
                <View style={styles.actionSection}>
                    <Pressable
                        style={[
                            styles.completeButton,
                            getProgress() >= 100 && styles.completedButton
                        ]}
                        onPress={handleVideoComplete}
                    >
                        <Ionicons name="checkmark" size={20} color="white" />
                        <Text style={styles.completeButtonText}>
                            {getProgress() >= 100 ? 'Đã hoàn thành' : 'Hoàn thành video'}
                        </Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    videoContainer: {
        backgroundColor: 'black',
    },
    videoPlayer: {
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnailText: {
        color: 'white',
        fontSize: 16,
    },
    videoPlaceholder: {
        alignItems: 'center',
        gap: 8,
    },
    videoPlaceholderText: {
        color: colors.mutedForeground,
        fontSize: 14,
    },
    playButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.brandCoral,
        borderRadius: 2,
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        minWidth: 80,
        textAlign: 'center',
    },
    controlButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    controlButton: {
        padding: 8,
    },
    spacer: {
        flex: 1,
    },
    infoSection: {
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.foreground,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
        marginBottom: 12,
    },
    metadata: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metadataText: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    section: {
        backgroundColor: 'white',
        marginTop: 1,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    chapterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 8,
        gap: 12,
    },
    selectedChapter: {
        backgroundColor: `${colors.brandCoral}15`,
        borderLeftWidth: 3,
        borderLeftColor: colors.brandCoral,
    },
    chapterNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.muted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterNumberText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.foreground,
    },
    chapterContent: {
        flex: 1,
    },
    chapterTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.foreground,
        marginBottom: 2,
    },
    chapterTime: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    transcriptContainer: {
        backgroundColor: colors.muted + '40',
        padding: 16,
        borderRadius: 8,
    },
    transcriptText: {
        fontSize: 14,
        color: colors.foreground,
        lineHeight: 22,
    },
    actionSection: {
        padding: 20,
        backgroundColor: 'white',
        marginTop: 1,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.brandCoral,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    completedButton: {
        backgroundColor: colors.success,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});