import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface WritingResponseProps {
    timeLimit?: number;
    wordLimit?: number;
    onSubmit?: (response: string) => void;
    onSave?: (response: string) => void;
}

const WritingResponse: React.FC<WritingResponseProps> = ({
    timeLimit = 30,
    wordLimit = 250,
    onSubmit,
    onSave,
}) => {
    const [response, setResponse] = useState('');
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;
    const wordsRemaining = Math.max(0, wordLimit - wordCount);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!isTimerRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsTimerRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerRunning, timeLeft]);

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(response);
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave(response);
        }
    };

    const getWordCountColor = () => {
        if (wordCount >= wordLimit) return '#22c55e';
        if (wordCount >= wordLimit * 0.8) return '#f59e0b';
        return '#6b7280';
    };

    const getTimeColor = () => {
        if (timeLeft <= 300) return '#ef4444'; // 5 minutes
        if (timeLeft <= 600) return '#f59e0b'; // 10 minutes
        return '#6b7280';
    };

    return (
        <View style={styles.container}>
            <View style={styles.responseHeader}>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="clock" size={16} color={getTimeColor()} />
                        <Text style={[styles.statText, { color: getTimeColor() }]}>
                            {formatTime(timeLeft)}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="file-alt" size={16} color={getWordCountColor()} />
                        <Text style={[styles.statText, { color: getWordCountColor() }]}>
                            {wordCount} words
                        </Text>
                    </View>
                    {wordsRemaining > 0 && (
                        <View style={styles.statItem}>
                            <FontAwesome5 name="target" size={16} color="#6b7280" />
                            <Text style={styles.statText}>
                                {wordsRemaining} more needed
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={response}
                    onChangeText={setResponse}
                    multiline
                    placeholder="Start writing your response here..."
                    placeholderTextColor="#999"
                    textAlignVertical="top"
                    editable={timeLeft > 0}
                />

                {timeLeft <= 0 && (
                    <View style={styles.timeUpOverlay}>
                        <FontAwesome5 name="clock" size={32} color="#ef4444" />
                        <Text style={styles.timeUpText}>Time's Up!</Text>
                    </View>
                )}
            </View>

            <View style={styles.actionBar}>
                <Pressable
                    style={[styles.saveButton, !response.trim() && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={!response.trim()}
                >
                    <FontAwesome5 name="save" size={16} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Draft</Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.submitButton,
                        (wordCount < wordLimit || !response.trim()) && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={wordCount < wordLimit || !response.trim()}
                >
                    <FontAwesome5 name="paper-plane" size={16} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    responseHeader: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontWeight: '500',
    },
    textInputContainer: {
        flex: 1,
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        position: 'relative',
    },
    textInput: {
        flex: 1,
        padding: 20,
        fontSize: 16,
        lineHeight: 24,
        color: '#1e293b',
        textAlignVertical: 'top',
    },
    timeUpOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    timeUpText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ef4444',
        marginTop: 8,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        gap: 12,
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6b7280',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default WritingResponse;