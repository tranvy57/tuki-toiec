import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    useWindowDimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';

interface OpinionEssayPromptProps {
    topic: string;
    timeLimit?: number;
    wordLimit?: number;
}

const OpinionEssayPrompt: React.FC<OpinionEssayPromptProps> = ({
    topic,
    timeLimit = 30,
    wordLimit = 250,
}) => {
    const { width } = useWindowDimensions();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.promptCard}>
                <View style={styles.taskHeader}>
                    <FontAwesome5 name="edit" size={24} color="#2563eb" />
                    <Text style={styles.taskType}>Opinion Essay</Text>
                </View>

                <Text style={styles.promptTitle}>Writing Task</Text>
                <Text style={styles.promptText}>
                    You have {timeLimit} minutes to write an essay on the following topic:
                </Text>

                <View style={styles.topicContainer}>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: topic }}
                        tagsStyles={{
                            p: styles.topicText,
                        }}
                    />
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructionItem}>• Write at least {wordLimit} words</Text>
                    <Text style={styles.instructionItem}>• Present a clear argument</Text>
                    <Text style={styles.instructionItem}>• Use relevant examples</Text>
                    <Text style={styles.instructionItem}>• Organize your ideas clearly</Text>
                    <Text style={styles.instructionItem}>• Include introduction, body paragraphs, and conclusion</Text>
                </View>

                <View style={styles.structureContainer}>
                    <Text style={styles.structureTitle}>Suggested Structure:</Text>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>1</Text>
                        <Text style={styles.stepText}>Introduction: State your opinion clearly</Text>
                    </View>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>2</Text>
                        <Text style={styles.stepText}>Body 1: First supporting argument with examples</Text>
                    </View>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>3</Text>
                        <Text style={styles.stepText}>Body 2: Second supporting argument with examples</Text>
                    </View>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>4</Text>
                        <Text style={styles.stepText}>Conclusion: Summarize and restate your opinion</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 16,
    },
    promptCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    taskType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563eb',
    },
    promptTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
    },
    promptText: {
        fontSize: 16,
        color: '#475569',
        lineHeight: 24,
        marginBottom: 16,
    },
    topicContainer: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
    },
    topicText: {
        fontSize: 16,
        color: '#334155',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    instructionsContainer: {
        marginBottom: 20,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    instructionItem: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
        lineHeight: 20,
    },
    structureContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    structureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    structureStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2563eb',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
        fontSize: 12,
        fontWeight: '600',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
});

export default OpinionEssayPrompt;