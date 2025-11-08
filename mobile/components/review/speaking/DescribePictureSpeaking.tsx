import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SplitPanel } from 'react-native-split-panel';
import { Audio } from 'expo-av';
import { useSpeechToText } from '~/hooks/useSpeechToText';

interface DescribePictureSpeakingProps {
    imageUri: string;
    preparationTime?: number;
    speakingTime?: number;
    onRecordingComplete?: (audioUri: string) => void;
    onSubmit?: (audioUri: string) => void;
}

const DescribePictureSpeaking: React.FC<DescribePictureSpeakingProps> = ({
    imageUri,
    preparationTime = 30,
    speakingTime = 45,
    onRecordingComplete,
    onSubmit,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [phase, setPhase] = useState<'instruction' | 'preparation' | 'recording' | 'review'>('instruction');
    const [timeLeft, setTimeLeft] = useState(preparationTime);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);

    // Speech to text hook
    const {
        text: transcriptText,
        isListening: isSpeechListening,
        error: speechError,
        startListening,
        stopListening,
        clearText: clearTranscript,
        isSupported: isSpeechSupported
    } = useSpeechToText({
        language: 'en-US', // You can change this to 'vi-VN' for Vietnamese
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
            cleanupAudio();
        };
    }, []);

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
        } catch (error) {
            console.error('Failed to cleanup audio:', error);
        }
    };

    const startPreparation = () => {
        setPhase('preparation');
        setTimeLeft(preparationTime);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setPhase('recording');
                    setTimeLeft(speakingTime);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
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

    const handleSubmit = () => {
        if (audioUri) {
            onSubmit?.(audioUri);
        }
    };

    const handlePlayAudio = async () => {
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderImageToDescribe = () => (
        <ScrollView
            style={styles.imageContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContent}
        >
            {phase === 'instruction' && (
                <View style={styles.instructionImageHeader}>
                    <Text style={styles.instructionHeaderText}>Picture to Describe:</Text>
                </View>
            )}
            <Image
                source={{ uri: imageUri }}
                style={styles.imageToDescribe}
                resizeMode="contain"
            />
        </ScrollView>
    );

    const renderControlPanel = () => {
        return (
            <ScrollView
                style={styles.controlPanelContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.controlPanelContent}
            >
                {renderRecordingInterface()}
            </ScrollView>
        );
    };

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
                            : 'Tap to record'
                    }
                </Text>

                {/* Audio Playback Component */}
                {audioUri && !isRecording && (
                    <View style={styles.audioPlayerContainer}>
                        <Pressable style={styles.playButton} onPress={handlePlayAudio}>
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
                    Description Notes:
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
                                ? "Start recording to see your description"
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
        </View>
    );

    const { width, height } = Dimensions.get('window');

    return (
        <SplitPanel
            style={styles.container}
            paneStyle={styles.paneStyle}
            pane1Style={styles.pane1Style}
            pane2Style={styles.pane2Style}
            maxSize={width}
        >
            {renderImageToDescribe()}
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

    // Instructions styles
    instructionsContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    headerCard: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 8,
    },
    directionsCard: {
        backgroundColor: '#EEF2FF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    directionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    directionsText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    highlight: {
        fontWeight: '600',
        color: '#3B82F6',
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

    // Image display styles
    imageContainer: {
        flex: 1,
    },
    imageScrollContent: {
        flexGrow: 1,
    },
    instructionImageHeader: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        marginHorizontal: 20,
    },
    instructionHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6',
        textAlign: 'center',
    },
    imageToDescribe: {
        width: '100%',
        flex: 1,
        minHeight: 200,
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
        backgroundColor: '#EF4444',
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
        backgroundColor: '#DC2626',
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
});

export default DescribePictureSpeaking;
