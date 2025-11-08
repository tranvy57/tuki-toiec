import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ArgumentativeEssayPromptProps {
    topic: string;
    timeLimit?: number;
    wordLimit?: number;
}

const ArgumentativeEssayPrompt: React.FC<ArgumentativeEssayPromptProps> = ({
    topic,
    timeLimit = 30,
    wordLimit = 250,
}) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.promptCard}>
                <View style={styles.taskHeader}>
                    <FontAwesome5 name="balance-scale" size={24} color="#f59e0b" />
                    <Text style={styles.taskType}>Argumentative Essay</Text>
                </View>

                <Text style={styles.promptTitle}>Writing Task</Text>
                <Text style={styles.promptText}>
                    You have {timeLimit} minutes to write an argumentative essay on the following topic:
                </Text>

                <View style={styles.topicContainer}>
                    <Text style={styles.topicText}>"{topic}"</Text>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructionItem}>• Write at least {wordLimit} words</Text>
                    <Text style={styles.instructionItem}>• Discuss both sides of the argument</Text>
                    <Text style={styles.instructionItem}>• Give your own opinion with reasons</Text>
                    <Text style={styles.instructionItem}>• Support your arguments with examples</Text>
                    <Text style={styles.instructionItem}>• Use appropriate linking words</Text>
                </View>

                <View style={styles.structureContainer}>
                    <Text style={styles.structureTitle}>Essay Structure:</Text>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Introduction</Text>
                            <Text style={styles.stepDescription}>Paraphrase the topic and state your position</Text>
                        </View>
                    </View>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Body Paragraph 1</Text>
                            <Text style={styles.stepDescription}>Present one side of the argument with examples</Text>
                        </View>
                    </View>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Body Paragraph 2</Text>
                            <Text style={styles.stepDescription}>Present the other side with examples</Text>
                        </View>
                    </View>
                    <View style={styles.structureStep}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Conclusion</Text>
                            <Text style={styles.stepDescription}>Restate your opinion and summarize key points</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.linkingWordsContainer}>
                    <Text style={styles.linkingTitle}>Useful Linking Words:</Text>
                    <View style={styles.linkingSection}>
                        <Text style={styles.linkingCategory}>Contrast:</Text>
                        <Text style={styles.linkingWords}>However, On the other hand, Nevertheless, In contrast</Text>
                    </View>
                    <View style={styles.linkingSection}>
                        <Text style={styles.linkingCategory}>Addition:</Text>
                        <Text style={styles.linkingWords}>Furthermore, Moreover, In addition, Additionally</Text>
                    </View>
                    <View style={styles.linkingSection}>
                        <Text style={styles.linkingCategory}>Examples:</Text>
                        <Text style={styles.linkingWords}>For instance, For example, Such as, To illustrate</Text>
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
        color: '#f59e0b',
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
        backgroundColor: '#fef3c7',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    topicText: {
        fontSize: 16,
        color: '#92400e',
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
        marginBottom: 16,
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
        marginBottom: 12,
        gap: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f59e0b',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
        fontSize: 12,
        fontWeight: '600',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 2,
    },
    stepDescription: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
    },
    linkingWordsContainer: {
        backgroundColor: '#f0fdf4',
        borderRadius: 8,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#22c55e',
    },
    linkingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#166534',
        marginBottom: 12,
    },
    linkingSection: {
        marginBottom: 8,
    },
    linkingCategory: {
        fontSize: 14,
        fontWeight: '600',
        color: '#15803d',
        marginBottom: 4,
    },
    linkingWords: {
        fontSize: 14,
        color: '#16a34a',
        lineHeight: 20,
    },
});

export default ArgumentativeEssayPrompt;