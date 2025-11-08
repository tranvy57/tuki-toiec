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

interface Question {
    id: string;
    questionText: string;
    content?: string;
    directions?: string;
    audioUrl?: string;
    informationHtml?: string; // HTML content to display
    preparationTime?: number;
    speakingTime?: number;
}

interface RespondToUsingInformationProps {
    questions: Question[];
    onRecordingComplete?: (questionId: string, audioUri: string) => void;
    onSubmit?: (recordings: { questionId: string; audioUri: string }[]) => void;
}

const RespondToUsingInformation: React.FC<RespondToUsingInformationProps> = ({
    questions,
    onRecordingComplete,
    onSubmit,
}) => {
    const { width } = Dimensions.get('window');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState<{ [questionId: string]: string }>({});
    const [phase, setPhase] = useState<'instruction' | 'preparation' | 'recording' | 'review'>('instruction');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isQuestionAudioPlaying, setIsQuestionAudioPlaying] = useState(false);
    const [questionAudioPosition, setQuestionAudioPosition] = useState(0);
    const [questionAudioDuration, setQuestionAudioDuration] = useState(0);
    const [isInformationExpanded, setIsInformationExpanded] = useState(true); // Information expanded by default

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const questionAudioTimerRef = useRef<NodeJS.Timeout | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const questionSoundRef = useRef<Audio.Sound | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const currentAudioUri = recordings[currentQuestion?.id];

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
            if (questionAudioTimerRef.current) {
                clearInterval(questionAudioTimerRef.current);
            }
            cleanupAudio();
        };
    }, []);

    // Load question audio when current question changes
    useEffect(() => {
        if (currentQuestion?.audioUrl) {
            loadQuestionAudio();
        }
        return () => {
            cleanupQuestionAudio();
        };
    }, [currentQuestionIndex]);

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
            if (questionSoundRef.current) {
                await questionSoundRef.current.unloadAsync();
                questionSoundRef.current = null;
            }
        } catch (error) {
            console.error('Failed to cleanup audio:', error);
        }
    };

    const cleanupQuestionAudio = async () => {
        try {
            if (questionSoundRef.current) {
                await questionSoundRef.current.unloadAsync();
                questionSoundRef.current = null;
            }
            setIsQuestionAudioPlaying(false);
            setQuestionAudioPosition(0);
            setQuestionAudioDuration(0);
            if (questionAudioTimerRef.current) {
                clearInterval(questionAudioTimerRef.current);
            }
        } catch (error) {
            console.error('Failed to cleanup question audio:', error);
        }
    };

    const loadQuestionAudio = async () => {
        try {
            if (!currentQuestion?.audioUrl) return;

            await cleanupQuestionAudio();

            const { sound } = await Audio.Sound.createAsync({ uri: currentQuestion.audioUrl });
            questionSoundRef.current = sound;

            const status = await sound.getStatusAsync();
            if (status.isLoaded && status.durationMillis) {
                setQuestionAudioDuration(Math.ceil(status.durationMillis / 1000));
            }
        } catch (error) {
            console.error('Failed to load question audio:', error);
        }
    };

    const startRecording = async () => {
        try {
            setPhase('recording');
            setIsRecording(true);
            setTimeLeft(currentQuestion?.speakingTime || 30);

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
                if (uri && currentQuestion) {
                    setRecordings(prev => ({
                        ...prev,
                        [currentQuestion.id]: uri
                    }));

                    // Get audio duration
                    const { sound } = await Audio.Sound.createAsync({ uri });
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded && status.durationMillis) {
                        setAudioDuration(Math.ceil(status.durationMillis / 1000));
                    }
                    await sound.unloadAsync();
                    onRecordingComplete?.(currentQuestion.id, uri);
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
        if (currentQuestion) {
            setRecordings(prev => {
                const newRecordings = { ...prev };
                delete newRecordings[currentQuestion.id];
                return newRecordings;
            });
        }
        setAudioDuration(0);
        clearTranscript();
        await resetAudioPlayback();
        setPhase('recording');
        startRecording();
    };

    const handleQuestionAudioPlay = async () => {
        try {
            if (isQuestionAudioPlaying) {
                // Pause question audio
                if (questionSoundRef.current) {
                    await questionSoundRef.current.pauseAsync();
                }
                setIsQuestionAudioPlaying(false);
                if (questionAudioTimerRef.current) {
                    clearInterval(questionAudioTimerRef.current);
                }
            } else {
                // Play question audio
                if (!questionSoundRef.current) {
                    await loadQuestionAudio();
                }

                if (questionSoundRef.current) {
                    await questionSoundRef.current.setPositionAsync(questionAudioPosition * 1000);
                    await questionSoundRef.current.playAsync();
                    setIsQuestionAudioPlaying(true);

                    // Update playback time
                    questionAudioTimerRef.current = setInterval(async () => {
                        const status = await questionSoundRef.current!.getStatusAsync();
                        if (status.isLoaded) {
                            const currentTime = Math.ceil((status.positionMillis || 0) / 1000);
                            setQuestionAudioPosition(currentTime);

                            if (!status.isPlaying || currentTime >= questionAudioDuration) {
                                setIsQuestionAudioPlaying(false);
                                setQuestionAudioPosition(0);
                                clearInterval(questionAudioTimerRef.current!);
                            }
                        }
                    }, 100);
                }
            }
        } catch (error) {
            console.error('Failed to play question audio:', error);
            setIsQuestionAudioPlaying(false);
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
                if (!currentAudioUri) return;

                if (soundRef.current) {
                    await soundRef.current.unloadAsync();
                }

                const { sound } = await Audio.Sound.createAsync({ uri: currentAudioUri });
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

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setPhase('instruction');
            clearTranscript();
            resetAudioPlayback();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setPhase('instruction');
            clearTranscript();
            resetAudioPlayback();
        }
    };

    const handleSubmitAll = () => {
        const recordingsList = Object.entries(recordings).map(([questionId, audioUri]) => ({
            questionId,
            audioUri
        }));
        onSubmit?.(recordingsList);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderQuestionPanel = () => (
        <ScrollView
            style={styles.questionContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.questionScrollContent}
        >
            {/* Question Audio Player */}
            {currentQuestion?.audioUrl && (
                <View style={styles.questionAudioContainer}>
                    <Pressable
                        style={styles.questionPlayButton}
                        onPress={handleQuestionAudioPlay}
                    >
                        <FontAwesome5
                            name={isQuestionAudioPlaying ? "pause" : "play"}
                            size={16}
                            color="#3B82F6"
                        />
                    </Pressable>

                    <View style={styles.questionAudioProgress}>
                        <Text style={styles.questionAudioTime}>
                            {formatTime(questionAudioPosition)}/{formatTime(questionAudioDuration)}
                        </Text>
                        <View style={styles.questionProgressBar}>
                            <View style={[
                                styles.questionProgress,
                                {
                                    width: `${questionAudioDuration > 0 ?
                                        (questionAudioPosition / questionAudioDuration) * 100 : 0}%`
                                }
                            ]} />
                        </View>
                    </View>

                    <Pressable style={styles.volumeButton}>
                        <FontAwesome5 name="volume-up" size={16} color="#6B7280" />
                    </Pressable>
                </View>
            )}

            {/* Information Section */}
            {currentQuestion?.informationHtml && (
                <View style={styles.informationContainer}>
                    <Pressable
                        style={styles.informationHeader}
                        onPress={() => setIsInformationExpanded(!isInformationExpanded)}
                    >
                        <FontAwesome5 name="info-circle" size={16} color="#F59E0B" />
                        <Text style={styles.informationLabel}>Information</Text>
                        <FontAwesome5
                            name={isInformationExpanded ? "chevron-up" : "chevron-down"}
                            size={14}
                            color="#6B7280"
                        />
                    </Pressable>
                    {isInformationExpanded && (
                        <View style={styles.informationContent}>
                            <ScrollView style={styles.informationScroll} showsVerticalScrollIndicator={false}>
                                <RenderHtml
                                    contentWidth={width - 64} // Account for padding
                                    source={{ html: currentQuestion.informationHtml || '<p>No information available</p>' }}
                                    tagsStyles={{
                                        p: styles.informationText,
                                        div: styles.informationText,
                                        span: styles.informationText,
                                        h1: { ...styles.informationText, fontSize: 18, fontWeight: 'bold' },
                                        h2: { ...styles.informationText, fontSize: 16, fontWeight: 'bold' },
                                        h3: { ...styles.informationText, fontSize: 15, fontWeight: 'bold' },
                                        strong: { ...styles.informationText, fontWeight: 'bold' },
                                        b: { ...styles.informationText, fontWeight: 'bold' },
                                        em: { ...styles.informationText, fontStyle: 'italic' },
                                        i: { ...styles.informationText, fontStyle: 'italic' },
                                    }}
                                />
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}

            {/* Audio Transcript
            <View style={styles.transcriptContainer}>
                <Pressable
                    style={styles.transcriptHeader}
                    onPress={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                >
                    <FontAwesome5 name="file-alt" size={16} color="#3B82F6" />
                    <Text style={styles.transcriptLabel}>Audio transcript</Text>
                    <FontAwesome5
                        name={isTranscriptExpanded ? "chevron-up" : "chevron-down"}
                        size={14}
                        color="#6B7280"
                    />
                </Pressable>
                {isTranscriptExpanded && (
                    <View style={styles.transcriptContent}>
                        {currentQuestion?.content && (
                            <View style={styles.transcriptItem}>
                                <Text style={styles.transcriptSectionTitle}>Context:</Text>
                                <RenderHtml
                                    contentWidth={width - 64}
                                    source={{ html: currentQuestion.content }}
                                    tagsStyles={{
                                        p: styles.transcriptSectionText,
                                        div: styles.transcriptSectionText,
                                        span: styles.transcriptSectionText,
                                    }}
                                />
                            </View>
                        )}
                        {currentQuestion?.directions && (
                            <View style={styles.transcriptItem}>
                                <Text style={styles.transcriptSectionTitle}>Directions:</Text>
                                <RenderHtml
                                    contentWidth={width - 64}
                                    source={{ html: currentQuestion.directions }}
                                    tagsStyles={{
                                        p: styles.transcriptSectionText,
                                        div: styles.transcriptSectionText,
                                        span: styles.transcriptSectionText,
                                    }}
                                />
                            </View>
                        )}
                        {currentQuestion?.questionText && (
                            <View style={styles.transcriptItem}>
                                <Text style={styles.transcriptSectionTitle}>Question:</Text>
                                <RenderHtml
                                    contentWidth={width - 64}
                                    source={{ html: currentQuestion.questionText }}
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
            </View> */}

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
                <Pressable
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <FontAwesome5 name="chevron-left" size={16} color={currentQuestionIndex === 0 ? "#9CA3AF" : "#3B82F6"} />
                    <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
                        Previous
                    </Text>
                </Pressable>

                <Text style={styles.questionCounter}>
                    {currentQuestionIndex + 1} / {questions.length}
                </Text>

                <Pressable
                    style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled]}
                    onPress={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    <Text style={[styles.navButtonText, currentQuestionIndex === questions.length - 1 && styles.navButtonTextDisabled]}>
                        Next
                    </Text>
                    <FontAwesome5 name="chevron-right" size={16} color={currentQuestionIndex === questions.length - 1 ? "#9CA3AF" : "#3B82F6"} />
                </Pressable>
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
                    onPress={isRecording ? stopRecording : (currentAudioUri ? handleReRecord : startRecording)}
                >
                    <FontAwesome5
                        name={isRecording ? "stop" : (currentAudioUri ? "redo" : "microphone")}
                        size={24}
                        color="#FFFFFF"
                    />
                </Pressable>

                <Text style={styles.recordingStatus}>
                    {isRecording
                        ? `Recording... ${formatTime(timeLeft)}`
                        : currentAudioUri
                            ? 'Tap to re-record'
                            : 'Tap to record'
                    }
                </Text>

                {/* Audio Playback Component */}
                {currentAudioUri && !isRecording && (
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
                    Response Transcript:
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
                    ) : currentAudioUri && !transcriptText ? (
                        <Text style={styles.transcriptText}>
                            {isSpeechSupported
                                ? "No speech detected during recording"
                                : "Speech recognition not available on this device"
                            }
                        </Text>
                    ) : (
                        <Text style={styles.transcriptPlaceholder}>
                            {isSpeechSupported
                                ? "Start recording to see your response transcript"
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
            {Object.keys(recordings).length === questions.length && (
                <Pressable style={styles.submitButton} onPress={handleSubmitAll}>
                    <Text style={styles.submitButtonText}>Submit All Responses</Text>
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
            {renderQuestionPanel()}
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

    // Question panel styles
    questionContainer: {
        flex: 1,
    },
    questionScrollContent: {
        flexGrow: 1,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    timerText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    questionNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionNumber: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    questionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    recordIndicator: {
        padding: 4,
    },
    recordDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#D1D5DB',
    },
    recordDotActive: {
        backgroundColor: '#EF4444',
    },
    questionAudioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    questionPlayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionAudioProgress: {
        flex: 1,
    },
    questionAudioTime: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    questionProgressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    questionProgress: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    volumeButton: {
        padding: 8,
    },

    // Information section styles
    informationContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    informationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 12,
        paddingVertical: 4,
    },
    informationLabel: {
        fontSize: 14,
        color: '#F59E0B',
        fontWeight: '500',
        flex: 1,
    },
    informationContent: {
        backgroundColor: '#FFFBEB',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#FEF3C7',
        maxHeight: 200,
    },
    informationScroll: {
        maxHeight: 180,
    },
    informationText: {
        fontSize: 14,
        color: '#92400E',
        lineHeight: 20,
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
    navigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginTop: 'auto',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
    },
    navButtonTextDisabled: {
        color: '#9CA3AF',
    },
    questionCounter: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
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

export default RespondToUsingInformation;
