import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    TextInput,
    StyleSheet,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';

interface DictationSegment {
    text: string;
    start_time: number;
    end_time: number;
}

interface DictationCorrectAnswer {
    segment_index: number;
    start_position: number;
    end_position: number;
    text: string;
}

interface DictationItem {
    id: number;
    title: string;
    difficulty: string;
    promptJsonb: {
        title?: string;
        instructions?: string;
        audio_url: string;
        segments: DictationSegment[];
        correct_answers: DictationCorrectAnswer[];
    };
}

interface DictationProps {
    item: DictationItem;
    onSubmit?: (answers: { [key: number]: string }) => void;
}

const Dictation: React.FC<DictationProps> = ({ item, onSubmit }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentSegment, setCurrentSegment] = useState(0);
    const [segmentInputs, setSegmentInputs] = useState<{ [key: string]: string }>({});
    const [segmentValidation, setSegmentValidation] = useState<{ [key: string]: boolean }>({});
    const playbackRef = useRef<NodeJS.Timeout | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    const { segments, correct_answers: correctAnswers } = item.promptJsonb;

    useEffect(() => {
        loadAudio();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
            if (playbackRef.current) {
                clearInterval(playbackRef.current);
            }
        };
    }, []);

    const loadAudio = async () => {
        try {
            const { sound: audioSound } = await Audio.Sound.createAsync(
                { uri: item.promptJsonb.audio_url },
                { shouldPlay: false }
            );

            setSound(audioSound);

            const status = await audioSound.getStatusAsync();
            if (status.isLoaded) {
                setAudioDuration(status.durationMillis || 0);
            }

            audioSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.positionMillis !== undefined) {
                    setPlaybackTime(status.positionMillis);
                    setIsPlaying(status.isPlaying || false);
                }
            });
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    };

    const handlePlayPause = async () => {
        if (!sound) return;

        try {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
                if (status.isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                }
            }
        } catch (error) {
            console.error('Error controlling audio playback:', error);
        }
    };

    const playSegment = async (segmentIndex: number) => {
        if (!sound) return;

        try {
            const segment = segments[segmentIndex];
            await sound.setPositionAsync(segment.start_time * 1000);
            await sound.playAsync();

            // Schedule pause at end time
            setTimeout(async () => {
                await sound.pauseAsync();
            }, (segment.end_time - segment.start_time) * 1000);

            setCurrentSegment(segmentIndex);
        } catch (error) {
            console.error('Error playing segment:', error);
        }
    };

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const checkFullAnswer = (segmentIndex: number, value: string) => {
        const correctAnswer = correctAnswers.find(answer => answer.segment_index === segmentIndex);

        if (correctAnswer) {
            // Split input and clean up
            const userWords = value.trim() === '' ? [] : value.trim().split(/\s+/);
            const correctWords = correctAnswer.text.split(' ');

            // Update individual word validation and inputs
            const newValidation: { [key: string]: boolean } = {};
            const newInputs: { [key: string]: string } = {};

            correctWords.forEach((correctWord, wordIndex) => {
                const inputKey = `${segmentIndex}-${wordIndex}`;
                const userWord = userWords[wordIndex] || '';

                // Always update the input (even if empty)
                newInputs[inputKey] = userWord;

                // Only validate if user has entered something
                if (userWord) {
                    newValidation[inputKey] = userWord.toLowerCase().trim() === correctWord.toLowerCase();
                }
            });

            // Update segment inputs
            setSegmentInputs(prev => ({
                ...prev,
                ...newInputs
            }));

            // Update validation - clear old validations and set new ones
            setSegmentValidation(prev => {
                const updated = { ...prev };

                // Clear all validations for this segment first
                correctWords.forEach((_, wordIndex) => {
                    const inputKey = `${segmentIndex}-${wordIndex}`;
                    delete updated[inputKey];
                });

                // Add new validations
                Object.keys(newValidation).forEach(key => {
                    updated[key] = newValidation[key];
                });

                return updated;
            });
        }
    };

    const checkAnswer = (segmentIndex: number, wordIndex: number, value: string) => {
        const inputKey = `${segmentIndex}-${wordIndex}`;
        const correctAnswer = correctAnswers.find(answer => answer.segment_index === segmentIndex);

        if (correctAnswer) {
            const words = correctAnswer.text.split(' ');
            const correctWord = words[wordIndex];
            const isCorrect = value.toLowerCase().trim() === correctWord.toLowerCase();

            setSegmentValidation(prev => ({
                ...prev,
                [inputKey]: isCorrect
            }));
        }
    };

    const renderTranscriptSegment = (segment: DictationSegment, index: number) => {
        const correctAnswer = correctAnswers.find(answer => answer.segment_index === index);
        const isCurrentSegment = currentSegment === index;
        const isAnswered = correctAnswer && segmentInputs[`segment-${index}`] && segmentInputs[`segment-${index}`].trim() !== '';

        const renderSegmentText = () => {
            if (!correctAnswer) {
                return <Text style={styles.segmentText}>{segment.text}</Text>;
            }

            const beforeHidden = segment.text.substring(0, correctAnswer.start_position);
            const afterHidden = segment.text.substring(correctAnswer.end_position);
            const hiddenWords = correctAnswer.text.split(' ');

            return (
                <View style={styles.segmentTextContainer}>
                    <Text style={styles.segmentText}>{beforeHidden}</Text>
                    <View style={styles.hiddenWordsContainer}>
                        {hiddenWords.map((word, wordIndex) => {
                            const inputKey = `${index}-${wordIndex}`;
                            const userInput = segmentInputs[inputKey] || '';
                            const isValidated = segmentValidation[inputKey] !== undefined;
                            const isCorrect = segmentValidation[inputKey] === true;

                            return (
                                <Text
                                    key={wordIndex}
                                    style={[
                                        styles.hiddenWordPlaceholder,
                                        isValidated && (isCorrect ? styles.correctPlaceholder : styles.incorrectPlaceholder)
                                    ]}
                                >
                                    {userInput || "*".repeat(word.length)}
                                    {wordIndex < hiddenWords.length - 1 ? ' ' : ''}
                                </Text>
                            );
                        })}
                    </View>
                    <Text style={styles.segmentText}>{afterHidden}</Text>
                </View>
            );
        };

        return (
            <View
                key={index}
                style={[
                    styles.segmentContainer,
                    isCurrentSegment && styles.currentSegmentContainer,
                    isAnswered && styles.answeredSegmentContainer
                ]}
            >
                <View style={styles.segmentHeader}>
                    <Text style={[
                        styles.segmentNumber,
                        isCurrentSegment && styles.currentSegmentNumber,
                        isAnswered && styles.answeredSegmentNumber
                    ]}>
                        Segment {index + 1}
                    </Text>

                    <View style={styles.segmentControls}>
                        <Pressable
                            style={[styles.controlButton, isPlaying && styles.playingButton]}
                            onPress={() => playSegment(index)}
                        >
                            <FontAwesome5
                                name={isPlaying ? "pause" : "play"}
                                size={12}
                                color={isPlaying ? "#FFFFFF" : "#3B82F6"}
                            />
                        </Pressable>

                        <Pressable
                            style={styles.controlButton}
                            onPress={() => playSegment(index)}
                        >
                            <FontAwesome5 name="redo" size={12} color="#6B7280" />
                        </Pressable>

                        {correctAnswer && (
                            <Pressable
                                style={styles.controlButton}
                                onPress={() => {
                                    Alert.alert(
                                        'Hint',
                                        `Words to fill: ${correctAnswer.text.split(' ').map((word, idx) =>
                                            `${idx + 1}. ${word.charAt(0).toUpperCase()}... (${word.length} letters)`
                                        ).join('\n')}`,
                                        [{ text: 'OK' }]
                                    );
                                }}
                            >
                                <FontAwesome5 name="question" size={12} color="#F59E0B" />
                            </Pressable>
                        )}
                    </View>
                </View>

                <View style={styles.segmentContent}>
                    <View style={styles.segmentTextContainer}>
                        {renderSegmentText()}
                    </View>

                    {/* Input area for missing words */}
                    {correctAnswer && (
                        <TextInput
                            style={styles.fullAnswerInput}
                            value={segmentInputs[`segment-${index}`] || ''}
                            onChangeText={(value) => {
                                setSegmentInputs(prev => ({
                                    ...prev,
                                    [`segment-${index}`]: value
                                }));
                                checkFullAnswer(index, value);
                            }}
                            onFocus={() => {
                                // Scroll to input when focused
                                setTimeout(() => {
                                    scrollViewRef.current?.scrollToEnd({ animated: true });
                                }, 100);
                            }}
                            placeholder={`Enter all ${correctAnswer.text.split(' ').length} missing words separated by spaces`}
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                            autoCorrect={false}
                            multiline={true}
                        />
                    )}
                </View>
            </View>
        );
    };

    const handleSubmit = () => {
        const finalAnswers: { [key: number]: string } = {};

        correctAnswers.forEach(answer => {
            const segmentIndex = answer.segment_index;
            const fullInput = segmentInputs[`segment-${segmentIndex}`] || '';
            finalAnswers[segmentIndex] = fullInput.trim();
        });

        onSubmit?.(finalAnswers);
    };

    const calculateProgress = () => {
        const totalSegments = correctAnswers.length;
        const answeredSegments = correctAnswers.filter(answer => {
            const segmentInput = segmentInputs[`segment-${answer.segment_index}`];
            return segmentInput && segmentInput.trim() !== '';
        }).length;

        return { answered: answeredSegments, total: totalSegments };
    };

    const progress = calculateProgress();

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContentContainer}
            >
                {/* Audio Player */}
                <View style={styles.audioContainer}>
                    <Pressable
                        style={styles.playButton}
                        onPress={handlePlayPause}
                    >
                        <FontAwesome5
                            name={isPlaying ? "pause" : "play"}
                            size={20}
                            color="#FFFFFF"
                        />
                    </Pressable>

                    <View style={styles.audioProgressContainer}>
                        <Text style={styles.audioTime}>
                            {formatTime(playbackTime)} / {formatTime(audioDuration)}
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[
                                styles.progress,
                                {
                                    width: `${audioDuration > 0 ?
                                        (playbackTime / audioDuration) * 100 : 0}%`
                                }
                            ]} />
                        </View>
                    </View>

                    <Pressable style={styles.volumeButton}>
                        <FontAwesome5 name="volume-up" size={16} color="#6B7280" />
                    </Pressable>
                </View>

                {/* Transcript */}
                <View style={styles.transcriptContainer}>
                    <Text style={styles.transcriptTitle}>Complete the missing words</Text>
                    <Text style={styles.transcriptHint}>
                        Listen to each segment and fill in the missing words. Tap the segment controls to replay.
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.segmentsScrollView}
                        contentContainerStyle={styles.segmentsScrollContent}
                    >
                        {segments.map((segment, index) => renderTranscriptSegment(segment, index))}
                    </ScrollView>
                </View>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Overall Progress: {progress.answered} / {progress.total} segments completed
                    </Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[
                            styles.progressBarFill,
                            {
                                width: `${progress.total > 0 ?
                                    (progress.answered / progress.total) * 100 : 0}%`
                            }
                        ]} />
                    </View>
                </View>

                {/* Submit Button */}
                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Answers</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContentContainer: {
        paddingBottom: 100, // Extra padding for keyboard
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioProgressContainer: {
        flex: 1,
    },
    audioTime: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    progress: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    volumeButton: {
        padding: 8,
    },
    transcriptContainer: {
        margin: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    transcriptTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    transcriptHint: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    segmentsScrollView: {
        marginTop: 8,
    },
    segmentsScrollContent: {
        paddingHorizontal: 8,
    },
    segmentContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        marginHorizontal: 8,
        padding: 12,
        backgroundColor: '#F9FAFB',
        width: Dimensions.get('window').width * 0.8,
        minWidth: 300,
    },
    currentSegmentContainer: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    answeredSegmentContainer: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    segmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    segmentNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    currentSegmentNumber: {
        color: '#3B82F6',
    },
    answeredSegmentNumber: {
        color: '#10B981',
    },
    segmentControls: {
        flexDirection: 'row',
        gap: 8,
    },
    controlButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    playingButton: {
        backgroundColor: '#3B82F6',
    },
    segmentContent: {
        paddingTop: 8,
    },
    segmentText: {
        fontSize: 16,
        color: '#1F2937',
        lineHeight: 24,
    },
    segmentTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    hiddenWordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    hiddenWordPlaceholder: {
        fontSize: 16,
        color: '#6B7280',
        marginHorizontal: 2,
        fontFamily: 'monospace',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    correctPlaceholder: {
        color: '#065F46',
        backgroundColor: '#ECFDF5',
    },
    incorrectPlaceholder: {
        color: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    inputSection: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    fullAnswerInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        minHeight: 60,
        textAlignVertical: 'top',
    },
    answerHint: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    wordInputContainer: {
        alignItems: 'center',
        marginHorizontal: 2,
        marginVertical: 2,
    },
    wordInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 4,
        fontSize: 14,
        backgroundColor: '#FFFFFF',
        minWidth: 40,
        textAlign: 'center',
    },
    correctWordInput: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
        color: '#065F46',
    },
    incorrectWordInput: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
        color: '#DC2626',
    },
    wordHint: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 2,
    },
    progressContainer: {
        margin: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default Dictation;