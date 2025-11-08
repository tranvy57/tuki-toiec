import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SplitPanel } from 'react-native-split-panel';
import { Audio } from 'expo-av';
import RenderHtml from 'react-native-render-html';
import { useSpeechToText } from '~/hooks/useSpeechToText';

interface ExpressOpinionProps {
    topic: string;
    content?: string;
    directions?: string;
    audioUrl?: string;
    speakingTime?: number;
    onRecordingComplete?: (audioUri: string) => void;
    onSubmit?: (audioUri: string) => void;
}

const ExpressOpinion: React.FC<ExpressOpinionProps> = ({
    topic,
    content,
    directions,
    audioUrl,
    speakingTime = 60,
    onRecordingComplete,
    onSubmit,
}) => {
    const { width } = Dimensions.get('window');
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [phase, setPhase] = useState<'instruction' | 'recording' | 'review'>('instruction');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isTopicAudioPlaying, setIsTopicAudioPlaying] = useState(false);
    const [topicAudioPosition, setTopicAudioPosition] = useState(0);
    const [topicAudioDuration, setTopicAudioDuration] = useState(0);
    const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const topicAudioTimerRef = useRef<NodeJS.Timeout | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const topicSoundRef = useRef<Audio.Sound | null>(null);

    const {
        text: transcriptText,
        isListening: isSpeechListening,
        error: speechError,
        startListening,
        stopListening,
        clearText: clearTranscript,
        isSupported: isSpeechSupported
    } = useSpeechToText({
        language: 'en-US',
        onResult: (text) => {
            console.log('Speech recognition result:', text);
        },
        onError: (error) => {
            console.error('Speech recognition error:', error);
        }
    });

    // Cleanup timers on unmount
    useEffect(() => {
        setupAudio();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (playbackTimerRef.current) {
                clearInterval(playbackTimerRef.current);
            }
            if (topicAudioTimerRef.current) {
                clearInterval(topicAudioTimerRef.current);
            }
            cleanupAudio();
        };
    }, []);

    // Load topic audio when component mounts
    useEffect(() => {
        if (audioUrl) {
            loadTopicAudio();
        }
        return () => {
            cleanupTopicAudio();
        };
    }, [audioUrl]);

    const setupAudio = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (error) {
            console.error('Failed to setup audio:', error);
        }
    };

    const cleanupAudio = async () => {
        try {
            if (recordingRef.current) {
                await recordingRef.current.stopAndUnloadAsync();
                recordingRef.current = null;
            }
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
            if (topicSoundRef.current) {
                await topicSoundRef.current.unloadAsync();
                topicSoundRef.current = null;
            }
        } catch (error) {
            console.error('Failed to cleanup audio:', error);
        }
    };

    const cleanupTopicAudio = async () => {
        try {
            if (topicSoundRef.current) {
                await topicSoundRef.current.unloadAsync();
                topicSoundRef.current = null;
            }
            setIsTopicAudioPlaying(false);
            setTopicAudioPosition(0);
            setTopicAudioDuration(0);
            if (topicAudioTimerRef.current) {
                clearInterval(topicAudioTimerRef.current);
            }
        } catch (error) {
            console.error('Failed to cleanup topic audio:', error);
        }
    };

    const loadTopicAudio = async () => {
        try {
            if (!audioUrl) return;

            await cleanupTopicAudio();

            const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
            topicSoundRef.current = sound;

            const status = await sound.getStatusAsync();
            if (status.isLoaded && status.durationMillis) {
                setTopicAudioDuration(Math.ceil(status.durationMillis / 1000));
            }
        } catch (error) {
            console.error('Failed to load topic audio:', error);
        }
    };

    const startRecording = async () => {
        try {
            setPhase('recording');
            setIsRecording(true);
            setTimeLeft(speakingTime);

            // Clear previous transcript
            clearTranscript();

            const { recording } = await Audio.Recording.createAsync({
                isMeteringEnabled: true,
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                    audioQuality: Audio.IOSAudioQuality.MEDIUM,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 128000,
                },
            });

            recordingRef.current = recording;

            // Start speech-to-text if supported
            if (isSpeechSupported) {
                await startListening();
            }

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Failed to start recording:', error);
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        try {
            setIsRecording(false);
            setPhase('review');
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Stop speech-to-text
            if (isSpeechListening) {
                await stopListening();
            }

            if (recordingRef.current) {
                await recordingRef.current.stopAndUnloadAsync();
                const uri = recordingRef.current.getURI();
                if (uri) {
                    setAudioUri(uri);

                    // Get audio duration
                    const { sound } = await Audio.Sound.createAsync({ uri });
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded && status.durationMillis) {
                        setAudioDuration(Math.ceil(status.durationMillis / 1000));
                    }
                    await sound.unloadAsync();
                    onRecordingComplete?.(uri);
                }
                recordingRef.current = null;
            }

            // Reset audio playback state
            resetAudioPlayback();
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    const handleReRecord = async () => {
        setAudioUri(null);
        setAudioDuration(0);
        clearTranscript();
        await resetAudioPlayback();
        setPhase('recording');
        startRecording();
    };

    const handleTopicAudioPlay = async () => {
        try {
            if (isTopicAudioPlaying) {
                // Pause topic audio
                if (topicSoundRef.current) {
                    await topicSoundRef.current.pauseAsync();
                }
                setIsTopicAudioPlaying(false);
                if (topicAudioTimerRef.current) {
                    clearInterval(topicAudioTimerRef.current);
                }
            } else {
                // Play topic audio
                if (!topicSoundRef.current) {
                    await loadTopicAudio();
                }

                if (topicSoundRef.current) {
                    await topicSoundRef.current.setPositionAsync(topicAudioPosition * 1000);
                    await topicSoundRef.current.playAsync();
                    setIsTopicAudioPlaying(true);

                    // Update playback time
                    topicAudioTimerRef.current = setInterval(async () => {
                        const status = await topicSoundRef.current!.getStatusAsync();
                        if (status.isLoaded) {
                            const currentTime = Math.ceil((status.positionMillis || 0) / 1000);
                            setTopicAudioPosition(currentTime);

                            if (!status.isPlaying || currentTime >= topicAudioDuration) {
                                setIsTopicAudioPlaying(false);
                                setTopicAudioPosition(0);
                                clearInterval(topicAudioTimerRef.current!);
                            }
                        }
                    }, 100);
                }
            }
        } catch (error) {
            console.error('Failed to play topic audio:', error);
            setIsTopicAudioPlaying(false);
        }
    };

    const handleResponseAudioPlay = async () => {
        try {
            if (isPlaying) {
                // Pause audio
                if (soundRef.current) {
                    await soundRef.current.pauseAsync();
                }
                setIsPlaying(false);
                if (playbackTimerRef.current) {
                    clearInterval(playbackTimerRef.current);
                }
            } else {
                // Play audio
                if (!audioUri) return;

                if (soundRef.current) {
                    await soundRef.current.unloadAsync();
                }

                const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
                soundRef.current = sound;

                await sound.playAsync();
                setIsPlaying(true);

                // Update playback time
                playbackTimerRef.current = setInterval(async () => {
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded) {
                        const currentTime = Math.ceil((status.positionMillis || 0) / 1000);
                        setPlaybackTime(currentTime);

                        if (!status.isPlaying || currentTime >= audioDuration) {
                            setIsPlaying(false);
                            setPlaybackTime(0);
                            clearInterval(playbackTimerRef.current!);
                        }
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Failed to play audio:', error);
            setIsPlaying(false);
        }
    };

    const resetAudioPlayback = async () => {
        try {
            setIsPlaying(false);
            setPlaybackTime(0);
            if (playbackTimerRef.current) {
                clearInterval(playbackTimerRef.current);
            }
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
        } catch (error) {
            console.error('Failed to reset audio playback:', error);
        }
    };

    const handleSubmit = () => {
        if (audioUri) {
            onSubmit?.(audioUri);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderTopicPanel = () => (
        <ScrollView
            style={styles.topicContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.topicScrollContent}
        >
            {/* Phase Indicator */}
            

            {/* Topic Audio Player */}
            {audioUrl && (
                <View style={styles.topicAudioContainer}>
                    <Pressable
                        style={styles.topicPlayButton}
                        onPress={handleTopicAudioPlay}
                    >
                        <FontAwesome5
                            name={isTopicAudioPlaying ? "pause" : "play"}
                            size={16}
                            color="#3B82F6"
                        />
                    </Pressable>

                    <View style={styles.topicAudioProgress}>
                        <Text style={styles.topicAudioTime}>
                            {formatTime(topicAudioPosition)}/{formatTime(topicAudioDuration)}
                        </Text>
                        <View style={styles.topicProgressBar}>
                            <View style={[
                                styles.topicProgress,
                                {
                                    width: `${topicAudioDuration > 0 ?
                                        (topicAudioPosition / topicAudioDuration) * 100 : 0}%`
                                }
                            ]} />
                        </View>
                    </View>

                    <Pressable style={styles.volumeButton}>
                        <FontAwesome5 name="volume-up" size={16} color="#6B7280" />
                    </Pressable>
                </View>
            )}

            {/* Topic Content */}
            <View style={styles.topicContentContainer}>
                <Text style={styles.topicLabel}>Topic:</Text>
                <View style={styles.topicBox}>
                    <RenderHtml
                        contentWidth={width - 64}
                        source={{ html: topic }}
                        tagsStyles={{
                            p: styles.topicText,
                            div: styles.topicText,
                            span: styles.topicText,
                            strong: { ...styles.topicText, fontWeight: 'bold' },
                            b: { ...styles.topicText, fontWeight: 'bold' },
                            em: { ...styles.topicText, fontStyle: 'italic' },
                            i: { ...styles.topicText, fontStyle: 'italic' },
                        }}
                    />
                </View>
            </View>

            {/* Audio Transcript */}
            {(content || directions) && (
                <View style={styles.transcriptContainer}>
                    <Pressable
                        style={styles.transcriptHeader}
                        onPress={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                    >
                        <FontAwesome5 name="file-alt" size={16} color="#3B82F6" />
                        <Text style={styles.transcriptLabel}>Additional Information</Text>
                        <FontAwesome5
                            name={isTranscriptExpanded ? "chevron-up" : "chevron-down"}
                            size={14}
                            color="#6B7280"
                        />
                    </Pressable>
                    {isTranscriptExpanded && (
                        <View style={styles.transcriptContent}>
                            {content && (
                                <View style={styles.transcriptItem}>
                                    <Text style={styles.transcriptSectionTitle}>Context:</Text>
                                    <RenderHtml
                                        contentWidth={width - 64}
                                        source={{ html: content }}
                                        tagsStyles={{
                                            p: styles.transcriptSectionText,
                                            div: styles.transcriptSectionText,
                                            span: styles.transcriptSectionText,
                                        }}
                                    />
                                </View>
                            )}
                            {directions && (
                                <View style={styles.transcriptItem}>
                                    <Text style={styles.transcriptSectionTitle}>Directions:</Text>
                                    <RenderHtml
                                        contentWidth={width - 64}
                                        source={{ html: directions }}
                                        tagsStyles={{
                                            p: styles.transcriptSectionText,
                                            div: styles.transcriptSectionText,
                                            span: styles.transcriptSectionText,
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                {phase === 'instruction' && (
                    <Pressable style={styles.startButton} onPress={startRecording}>
                        <FontAwesome5 name="microphone" size={16} color="#FFFFFF" />
                        <Text style={styles.startButtonText}>Start Recording</Text>
                    </Pressable>
                )}
            </View>
        </ScrollView>
    );

    const renderControlPanel = () => (
        <ScrollView
            style={styles.controlPanelContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.controlPanelContent}
        >
            {renderRecordingInterface()}
        </ScrollView>
    );

    const renderRecordingInterface = () => (
        <View style={styles.recordingContainer}>
            {/* Recording Button */}
            <View style={styles.recordingSection}>
                <Pressable
                    style={[
                        styles.recordButton,
                        isRecording && styles.recordButtonActive
                    ]}
                    onPress={isRecording ? stopRecording : (audioUri ? handleReRecord : startRecording)}
                >
                    <FontAwesome5
                        name={isRecording ? "stop" : (audioUri ? "redo" : "microphone")}
                        size={24}
                        color="#FFFFFF"
                    />
                </Pressable>

                <Text style={styles.recordingStatus}>
                    {isRecording
                        ? `Recording... ${formatTime(timeLeft)}`
                        : audioUri
                            ? 'Tap to re-record'
                            : 'Tap to start recording'
                    }
                </Text>

                {/* Audio Playback Component */}
                {audioUri && !isRecording && (
                    <View style={styles.audioPlayerContainer}>
                        <Pressable style={styles.playButton} onPress={handleResponseAudioPlay}>
                            <FontAwesome5
                                name={isPlaying ? "pause" : "play"}
                                size={16}
                                color="#3B82F6"
                            />
                        </Pressable>
                        <View style={styles.audioProgressContainer}>
                            <View style={styles.audioProgressBar}>
                                <View style={[
                                    styles.audioProgress,
                                    { width: `${audioDuration > 0 ? (playbackTime / audioDuration) * 100 : 0}%` }
                                ]} />
                            </View>
                            <Text style={styles.audioTimeText}>
                                {formatTime(playbackTime)} / {formatTime(audioDuration)}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Transcript Section */}
            <View style={styles.transcriptSection}>
                <Text style={styles.transcriptTitle}>
                    Your Response:
                    {isSpeechListening && (
                        <Text style={styles.listeningIndicator}> 🎙️ Listening...</Text>
                    )}
                    {speechError && (
                        <Text style={styles.errorIndicator}> ⚠️ Error</Text>
                    )}
                </Text>
                <View style={styles.transcriptBox}>
                    {isRecording && transcriptText ? (
                        <Text style={styles.transcriptText}>
                            {transcriptText}
                        </Text>
                    ) : transcriptText && !isRecording ? (
                        <Text style={styles.transcriptText}>
                            {transcriptText}
                        </Text>
                    ) : audioUri && !transcriptText ? (
                        <Text style={styles.transcriptText}>
                            {isSpeechSupported
                                ? "No speech detected during recording"
                                : "Speech recognition not available on this device"
                            }
                        </Text>
                    ) : (
                        <Text style={styles.transcriptPlaceholder}>
                            {isSpeechSupported
                                ? "Start speaking to see your response transcript"
                                : "Speech recognition not supported"
                            }
                        </Text>
                    )}
                    {speechError && (
                        <Text style={styles.errorText}>
                            Speech recognition error: {speechError}
                        </Text>
                    )}
                </View>
            </View>

            {/* Submit Button */}
            {audioUri && (
                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Response</Text>
                </Pressable>
            )}
        </View>
    );

    return (
        <SplitPanel
            style={styles.container}
            paneStyle={styles.paneStyle}
            pane1Style={styles.pane1Style}
            pane2Style={styles.pane2Style}
        >
            {renderTopicPanel()}
            {renderControlPanel()}
        </SplitPanel>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#F8FAFC',
    },
    paneStyle: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    pane1Style: {
        backgroundColor: '#F0F4F8',
        padding: 16,
    },
    pane2Style: {
        backgroundColor: '#FFFFFF',
        padding: 16,
    },

    // Topic panel styles
    topicContainer: {
        flex: 1,
    },
    topicScrollContent: {
        flexGrow: 1,
    },
    phaseContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    phaseIndicator: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    phaseActive: {
        backgroundColor: '#3B82F6',
    },
    phaseText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },
    phaseTextActive: {
        color: '#FFFFFF',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    timerTextRecording: {
        color: '#EF4444',
    },
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    topicTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    topicAudioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    topicPlayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicAudioProgress: {
        flex: 1,
    },
    topicAudioTime: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    topicProgressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    topicProgress: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    volumeButton: {
        padding: 8,
    },
    topicContentContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    topicLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    topicBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    topicText: {
        fontSize: 16,
        color: '#1F2937',
        lineHeight: 24,
    },
    transcriptContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    transcriptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 12,
        paddingVertical: 4,
    },
    transcriptLabel: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
        flex: 1,
    },
    transcriptContent: {
        gap: 12,
    },
    transcriptItem: {
        marginBottom: 8,
    },
    transcriptSectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    transcriptSectionText: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 20,
    },
    actionContainer: {
        marginTop: 'auto',
        paddingTop: 16,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Recording interface styles
    controlPanelContainer: {
        flex: 1,
    },
    controlPanelContent: {
        flexGrow: 1,
    },
    recordingContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    recordingSection: {
        alignItems: 'center',
        paddingTop: 40,
    },
    recordButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    recordButtonActive: {
        backgroundColor: '#EF4444',
        transform: [{ scale: 1.1 }],
    },
    recordingStatus: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 20,
    },
    audioPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
    },
    playButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    audioProgressContainer: {
        flex: 1,
    },
    audioProgressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 4,
    },
    audioProgress: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    audioTimeText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'right',
    },
    transcriptSection: {
        flex: 1,
        marginTop: 40,
    },
    transcriptTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    transcriptBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minHeight: 120,
        flex: 1,
    },
    transcriptText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    transcriptPlaceholder: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 40,
    },
    listeningIndicator: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '500',
    },
    errorIndicator: {
        fontSize: 14,
        color: '#EF4444',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 8,
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: '#10B981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ExpressOpinion;
